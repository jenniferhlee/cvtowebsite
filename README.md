# CV-Driven Academic Website

This site treats `public/cv.docx` as the canonical structured CV source and
`public/cv.pdf` as the public downloadable and embeddable CV.

## Workflow

```text
public/cv.docx
  -> scripts/cv/parse_docx.py
  -> src/generated/cv-data.json
  -> src/content/cvGenerated.ts
  -> homepage, bio, publications, and work-in-progress sections

public/cv.pdf
  -> src/content/site.ts as cvUrl
  -> src/pages/cv.tsx
```

The parser uses only Python's standard library and never makes network calls.

## Local Development

Install dependencies, generate the CV JSON, and run the site:

```bash
npm install
npm run generate:cv
npm run dev
```

The build script regenerates CV data before exporting the static site:

```bash
npm run build
```

The static output is written to `out/`.

## Updating the CV

1. Replace `public/cv.docx` with the latest Word CV.
2. Replace `public/cv.pdf` with the latest public PDF CV.
3. Run `npm run generate:cv`.
4. Review `src/generated/cv-data.json` and the affected pages.

Root-level `CV.docx` is kept as a backwards-compatible fallback for the parser,
but workshop-facing documentation and scripts use `public/cv.docx`.
