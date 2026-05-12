import Head from "next/head";
import { Layout } from "../components/Layout";
import { Section } from "../components/Section";
import { profile, teaching } from "../content/cvGenerated";

export default function TeachingPage() {
  return (
    <Layout>
      <Head>
        <title>Teaching | {profile.name}</title>
      </Head>
      <section className="page-intro">
        <p className="eyebrow">Teaching</p>
        <h1>Teaching Experience</h1>
        <p>
          Courses include statistics for the social sciences, sociology of mental health,
          introductory sociology, research methods, and inequality.
        </p>
      </section>

      <Section title="Courses">
        <div className="entry-list">
          {teaching.map((course) => (
            <article key={course.text} className="entry">
              <div className="entry-meta">{course.year}</div>
              <p>{course.text}</p>
            </article>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
