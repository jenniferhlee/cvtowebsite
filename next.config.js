const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isProjectPage =
  process.env.GITHUB_ACTIONS === "true" &&
  repositoryName &&
  owner &&
  repositoryName !== `${owner}.github.io`;
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isProjectPage ? `/${repositoryName}` : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
