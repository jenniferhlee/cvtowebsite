const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) => {
  if (!path.startsWith("/")) {
    return path;
  }
  return `${basePath}${path}`.replace(/\/{2,}/g, "/");
};

export const site = {
  name: "Jennifer Hyunkyung Lee",
  title: "Ph.D. Candidate in Sociology",
  affiliation: "School of Sociology, University of Arizona",
  email: "jenniferhlee@arizona.edu",
  cvUrl: withBasePath("/cv.pdf"),
  cvDocxUrl: withBasePath("/cv.docx"),
  headshotUrl: withBasePath("/headshot.svg")
};
