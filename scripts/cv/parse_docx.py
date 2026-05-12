#!/usr/bin/env python3
"""Generate structured website CV data from a local Word CV."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.etree import ElementTree
from zipfile import BadZipFile, ZipFile


WORD_NS = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SECTION_ALIASES = {
    "education": {"EDUCATION"},
    "employment": {"EMPLOYMENT", "ACADEMIC EMPLOYMENT", "PROFESSIONAL EXPERIENCE"},
    "researchAreas": {"FIELDS OF INTEREST", "RESEARCH AREAS", "AREAS OF INTEREST"},
    "publications": {"PUBLICATIONS"},
    "workInProgress": {"WORK IN PROGRESS", "WORKING PAPERS"},
    "teaching": {"TEACHING", "TEACHING EXPERIENCE"},
    "presentations": {"PRESENTATIONS", "CONFERENCE PRESENTATIONS"},
    "invitedTalks": {"INVITED TALKS", "INVITED PRESENTATIONS"},
    "honorsGrants": {
        "GRANTS",
        "GRANTS AND FELLOWSHIP",
        "GRANTS AND FELLOWSHIPS",
        "FELLOWSHIPS",
        "HONORS",
        "HONORS AND AWARDS",
        "AWARDS",
    },
    "service": {"SERVICE", "PROFESSIONAL SERVICE"},
    "skills": {"SKILLS"},
    "memberships": {"PROFESSIONAL MEMBERSHIP", "PROFESSIONAL MEMBERSHIPS"},
    "references": {"REFERENCES"},
}

SECTION_BY_HEADING = {
    heading: section for section, headings in SECTION_ALIASES.items() for heading in headings
}

PUBLICATION_SUBHEADINGS = {
    "Peer-Reviewed Articles",
    "Revise and Resubmit",
    "Book Chapters",
    "Other",
}

WIP_SUBHEADINGS = {"Under Review", "Working Papers", "Manuscripts in Preparation"}


def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"^(\d{4})([A-Z])", r"\1 \2", text)
    text = re.sub(
        r"^(\d{4}(?:-\d{2})?|\d{4}-\d{4}|\d{4} \(Exp\.\))(?=[A-Za-z])",
        r"\1 ",
        text,
    )
    return (
        text.replace(",and", ", and")
        .replace("Presentedto", "Presented to")
        .replace("NewTheories", "New Theories")
    )


def resolve_input(requested: Path | None) -> Path:
    candidates: list[Path] = []
    if requested is not None:
        candidates.append(requested)
        if requested.as_posix().lower() == "public/cv.docx":
            candidates.extend([Path("CV.docx"), Path("cv.docx")])
    else:
        candidates.extend([Path("public/cv.docx"), Path("CV.docx"), Path("cv.docx")])

    for candidate in candidates:
        if candidate.exists():
            if requested is not None and candidate != requested:
                print(
                    f"Warning: {requested} was not found; using fallback {candidate}.",
                    file=sys.stderr,
                )
            return candidate

    expected = requested or Path("public/cv.docx")
    raise FileNotFoundError(f"Input CV not found: {expected}")


def extract_paragraphs(docx_path: Path) -> list[str]:
    try:
        with ZipFile(docx_path) as archive:
            document_xml = archive.read("word/document.xml")
    except KeyError as exc:
        raise ValueError(f"{docx_path} is not a valid Word document: missing word/document.xml") from exc
    except BadZipFile as exc:
        raise ValueError(f"{docx_path} is not a valid .docx file") from exc

    root = ElementTree.fromstring(document_xml)
    paragraphs = []
    for paragraph in root.iter(f"{WORD_NS}p"):
        text = clean("".join(node.text or "" for node in paragraph.iter(f"{WORD_NS}t")))
        if text:
            paragraphs.append(text)
    return paragraphs


def split_sections(paragraphs: list[str]) -> tuple[list[str], dict[str, list[str]]]:
    profile: list[str] = []
    sections = {section: [] for section in SECTION_ALIASES}
    current: str | None = None

    for paragraph in paragraphs:
        heading = paragraph.upper()
        if heading in SECTION_BY_HEADING:
            current = SECTION_BY_HEADING[heading]
            continue
        if current is None:
            profile.append(paragraph)
        else:
            sections[current].append(paragraph)

    return profile, sections


def starts_entry(text: str) -> bool:
    return bool(re.match(r"^(\d{4}|\d{4}-\d{2}|\d{4}-\d{4}|\d{4} \(Exp\.\))\b", text))


def year(text: str) -> str | None:
    match = re.match(r"^((?:19|20)\d{2})", text)
    return match.group(1) if match else None


def quoted_title(text: str) -> str | None:
    match = re.search(r"[\"\u201c]([^\"\u201d]+)[\"\u201d]", text)
    return match.group(1) if match else None


def first_url(text: str) -> str | None:
    match = re.search(r"https?://\S+", text)
    return match.group(0).rstrip(".") if match else None


def entries(lines: list[str], join_continuations: bool = True) -> list[dict[str, Any]]:
    parsed: list[dict[str, Any]] = []
    for line in lines:
        if join_continuations and parsed and not starts_entry(line):
            parsed[-1]["text"] = f"{parsed[-1]['text']} {line}"
        else:
            parsed.append({"text": line, "year": year(line)})
    return parsed


def publications(lines: list[str]) -> list[dict[str, Any]]:
    parsed: list[dict[str, Any]] = []
    category = "Publications"
    for line in lines:
        if line in PUBLICATION_SUBHEADINGS:
            category = line
            continue
        if parsed and not starts_entry(line) and parsed[-1]["category"] == category:
            parsed[-1]["citation"] = f"{parsed[-1]['citation']} {line}"
            parsed[-1]["title"] = quoted_title(parsed[-1]["citation"])
            parsed[-1]["url"] = first_url(parsed[-1]["citation"])
            continue
        parsed.append(
            {
                "category": category,
                "citation": line,
                "year": year(line),
                "title": quoted_title(line),
                "url": first_url(line),
            }
        )
    return parsed


def work_items(lines: list[str]) -> list[dict[str, Any]]:
    parsed: list[dict[str, Any]] = []
    status = "Work in Progress"
    for line in lines:
        if line in WIP_SUBHEADINGS:
            status = line
            continue
        parsed.append(
            {
                "status": status,
                "citation": line,
                "year": year(line),
                "title": quoted_title(line),
            }
        )
    return parsed


def research_areas(lines: list[str]) -> list[str]:
    text = " ".join(lines).replace(" and ", ", ")
    return [item.strip() for item in text.split(",") if item.strip()]


def profile(lines: list[str], sections: dict[str, list[str]]) -> dict[str, str | None]:
    education_text = " ".join(sections["education"])
    email = next(
        (match.group(0) for line in lines if (match := re.search(r"[\w.+-]+@[\w.-]+\.\w+", line))),
        None,
    )
    return {
        "name": lines[0] if lines else None,
        "title": "Ph.D. Candidate in Sociology" if "Ph.D." in education_text else None,
        "affiliation": lines[1] if len(lines) > 1 else None,
        "location": " ".join(lines[2:4]) if len(lines) > 3 else None,
        "email": email,
    }


def build_payload(docx_path: Path) -> dict[str, Any]:
    profile_lines, sections = split_sections(extract_paragraphs(docx_path))
    presentations = entries(sections["presentations"])
    invited = entries(sections["invitedTalks"]) + [
        item
        for item in presentations
        if "invited" in item["text"].lower() or "presented to" in item["text"].lower()
    ]
    return {
        "source": docx_path.as_posix(),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "profile": profile(profile_lines, sections),
        "researchAreas": research_areas(sections["researchAreas"]),
        "education": entries(sections["education"]),
        "employment": entries(sections["employment"]),
        "publications": publications(sections["publications"]),
        "workInProgress": work_items(sections["workInProgress"]),
        "teaching": entries(sections["teaching"]),
        "presentations": presentations,
        "invitedTalks": invited,
        "honorsGrants": entries(sections["honorsGrants"], join_continuations=False),
        "service": entries(sections["service"], join_continuations=False),
        "skills": sections["skills"],
        "memberships": sections["memberships"],
        "references": sections["references"],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate structured CV JSON from a DOCX CV.")
    parser.add_argument("--input", type=Path, default=None, help="Path to the canonical DOCX CV.")
    parser.add_argument("--output", type=Path, required=True, help="Path to write generated JSON.")
    args = parser.parse_args()

    try:
        docx_path = resolve_input(args.input)
        payload = build_payload(docx_path)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    except Exception as exc:
        print(f"CV generation failed: {exc}", file=sys.stderr)
        return 1

    print(f"Wrote {args.output} from {docx_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
