import { FounderCard } from "@/components/FounderCard";
import { Section } from "@/components/Section";
import { SITE } from "@/config/site";
import { ABOUT_INTRO, FOUNDERS } from "@/content/founders";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <>
      <Section eyebrow="About us" title={ABOUT_INTRO.heading} width="narrow">
        {ABOUT_INTRO.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.intro}>
            {paragraph}
          </p>
        ))}
      </Section>

      <Section tone="warm" title="Who we are">
        <ul className={styles.founderGrid}>
          {FOUNDERS.map((founder) => (
            <li key={founder.id}>
              <FounderCard founder={founder} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Get in touch"
        description="We genuinely want to hear from you. How is your family navigating AI? What questions do you have?"
        width="narrow"
      >
        <a href={`mailto:${SITE.contactEmail}`} className={styles.email}>
          {SITE.contactEmail}
        </a>
      </Section>
    </>
  );
}
