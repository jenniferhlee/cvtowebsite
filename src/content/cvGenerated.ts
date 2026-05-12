import rawCvData from "../generated/cv-data.json";
import { site } from "./site";

export type CvEntry = {
  text?: string;
  citation?: string;
  category?: string;
  status?: string;
  title?: string | null;
  year?: string | null;
  url?: string | null;
};

export type CvData = {
  source: string;
  generatedAt: string;
  profile: {
    name?: string | null;
    title?: string | null;
    affiliation?: string | null;
    location?: string | null;
    email?: string | null;
  };
  researchAreas: string[];
  education: CvEntry[];
  employment: CvEntry[];
  publications: CvEntry[];
  workInProgress: CvEntry[];
  teaching: CvEntry[];
  presentations: CvEntry[];
  invitedTalks: CvEntry[];
  honorsGrants: CvEntry[];
  service: CvEntry[];
  skills: string[];
  memberships: string[];
  references: string[];
};

export const cvData = rawCvData as CvData;

export const profile = {
  name: cvData.profile.name || site.name,
  title: cvData.profile.title || site.title,
  affiliation: cvData.profile.affiliation || site.affiliation,
  location: cvData.profile.location,
  email: cvData.profile.email || site.email
};

export const researchAreas = cvData.researchAreas;

export const selectedPublications = cvData.publications
  .filter((publication) => publication.category === "Peer-Reviewed Articles")
  .slice(0, 4);

export const publicationsByCategory = cvData.publications.reduce<Record<string, CvEntry[]>>(
  (groups, publication) => {
    const key = publication.category || "Publications";
    groups[key] = [...(groups[key] || []), publication];
    return groups;
  },
  {}
);

export const workInProgressByStatus = cvData.workInProgress.reduce<Record<string, CvEntry[]>>(
  (groups, work) => {
    const key = work.status || "Work in Progress";
    groups[key] = [...(groups[key] || []), work];
    return groups;
  },
  {}
);

export const workInProgress = cvData.workInProgress;
export const teaching = cvData.teaching;
export const honorsGrants = cvData.honorsGrants;
export const service = cvData.service;
