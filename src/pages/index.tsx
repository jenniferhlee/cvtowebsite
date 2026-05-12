import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/Layout";
import { Section } from "../components/Section";
import {
  profile,
  researchAreas,
  selectedPublications,
  workInProgress
} from "../content/cvGenerated";
import { site } from "../content/site";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>{profile.name} | Sociology</title>
        <meta
          name="description"
          content={`${profile.name} is a sociologist studying inequality, health, family, and the life course.`}
        />
      </Head>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{profile.affiliation}</p>
          <h1>{profile.name}</h1>
          <p className="hero-title">{profile.title}</p>
          <p>
            I study how work, family, health, and institutions shape stratification across
            gender, race, ethnicity, and the life course.
          </p>
          <div className="hero-actions">
            <Link href="/publications" className="button primary">
              Publications
            </Link>
            <Link href="/cv" className="button secondary">
              CV
            </Link>
          </div>
        </div>
        <div className="portrait-panel" aria-label={`${profile.name} portrait`}>
          <img src={site.headshotUrl} alt={profile.name} />
        </div>
      </section>

      <Section eyebrow="Research Areas" title="Core Interests">
        <div className="tag-list">
          {researchAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </Section>

      <Section eyebrow="Selected Publications" title="Recent Peer-Reviewed Work">
        <div className="entry-list">
          {selectedPublications.map((publication) => (
            <article key={publication.citation} className="entry">
              <div className="entry-meta">{publication.year}</div>
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

      <Section eyebrow="Work In Progress" title="Current Manuscripts">
        <div className="entry-list compact">
          {workInProgress.slice(0, 4).map((work) => (
            <article key={work.citation} className="entry">
              <div className="entry-meta">{work.status}</div>
              <p>{work.citation}</p>
            </article>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
