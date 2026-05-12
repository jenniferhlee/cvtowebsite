import Head from "next/head";
import { Layout } from "../components/Layout";
import { Section } from "../components/Section";
import { profile, researchAreas, workInProgress } from "../content/cvGenerated";

export default function ResearchPage() {
  return (
    <Layout>
      <Head>
        <title>Research | {profile.name}</title>
      </Head>
      <section className="page-intro">
        <p className="eyebrow">Research</p>
        <h1>Work, Family, Health, and Inequality</h1>
        <p>
          My research uses demographic and computational approaches to examine how
          institutions and social categories shape family trajectories, health, and
          inequality over the life course.
        </p>
      </section>

      <Section title="Areas">
        <div className="tag-list">
          {researchAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </Section>

      <Section title="Current Projects">
        <div className="entry-list compact">
          {workInProgress.map((work) => (
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
