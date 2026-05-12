import Head from "next/head";
import { Layout } from "../components/Layout";
import { Section } from "../components/Section";
import { cvData, profile, researchAreas } from "../content/cvGenerated";

export default function BioPage() {
  return (
    <Layout>
      <Head>
        <title>Bio | {profile.name}</title>
      </Head>
      <section className="page-intro">
        <p className="eyebrow">Bio</p>
        <h1>{profile.name}</h1>
        <p>
          {profile.title} at the {profile.affiliation}. Her research examines social
          stratification, health disparities, family, aging, race, ethnicity, and the life
          course.
        </p>
      </section>

      <Section title="Research Areas">
        <div className="tag-list">
          {researchAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="entry-list">
          {cvData.education.map((item) => (
            <article key={item.text} className="entry">
              <div className="entry-meta">{item.year}</div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
