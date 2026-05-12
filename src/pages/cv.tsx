import Head from "next/head";
import { Layout } from "../components/Layout";
import { profile } from "../content/cvGenerated";
import { site } from "../content/site";

export default function CvPage() {
  return (
    <Layout>
      <Head>
        <title>CV | {profile.name}</title>
      </Head>
      <section className="page-intro cv-intro">
        <div>
          <p className="eyebrow">Curriculum Vitae</p>
          <h1>CV</h1>
          <p>The public PDF CV is available to view, download, or open in a new tab.</p>
        </div>
        <div className="cv-actions">
          <a className="button primary" href={site.cvUrl} download>
            Download PDF
          </a>
          <a className="button secondary" href={site.cvUrl} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </div>
      </section>
      <section className="pdf-viewer" aria-label="Embedded CV PDF">
        <object data={site.cvUrl} type="application/pdf">
          <iframe src={site.cvUrl} title={`${profile.name} CV`} />
          <p>
            The PDF viewer is unavailable in this browser.{" "}
            <a href={site.cvUrl} download>
              Download the CV
            </a>
            .
          </p>
        </object>
      </section>
    </Layout>
  );
}
