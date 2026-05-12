import Head from "next/head";
import { Layout } from "../components/Layout";
import { Section } from "../components/Section";
import { profile, publicationsByCategory, workInProgressByStatus } from "../content/cvGenerated";

export default function PublicationsPage() {
  return (
    <Layout>
      <Head>
        <title>Publications | {profile.name}</title>
      </Head>
      <section className="page-intro">
        <p className="eyebrow">Publications</p>
        <h1>Publications and Working Papers</h1>
        <p>
          Publications and manuscript statuses are generated from the canonical Word CV.
        </p>
      </section>

      {Object.entries(publicationsByCategory).map(([category, publications]) => (
        <Section key={category} title={category}>
          <div className="entry-list">
            {publications.map((publication) => (
              <article key={publication.citation} className="entry">
                <div className="entry-meta">{publication.year || category}</div>
                <p>{publication.citation}</p>
                {publication.url ? (
                  <a href={publication.url} target="_blank" rel="noreferrer">
                    DOI
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </Section>
      ))}

      {Object.entries(workInProgressByStatus).map(([status, works]) => (
        <Section key={status} title={status}>
          <div className="entry-list compact">
            {works.map((work) => (
              <article key={work.citation} className="entry">
                <div className="entry-meta">{status}</div>
                <p>{work.citation}</p>
              </article>
            ))}
          </div>
        </Section>
      ))}
    </Layout>
  );
}
