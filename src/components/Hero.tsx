import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { SECTION_IDS } from "@/config/sections";
import { SITE } from "@/config/site";
import { scrollToSection } from "@/lib/scrollToSection";
import styles from "./Hero.module.css";

const EYEBROW = "For parents and families in the age of AI";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{EYEBROW}</p>
          <h1 className={styles.title}>{SITE.tagline}</h1>
          <p className={styles.mission}>{SITE.mission}</p>

          <div className={styles.actions}>
            <Button onClick={() => scrollToSection(SECTION_IDS.SUBSCRIBE)}>
              Subscribe free
            </Button>
            <Button
              variant="secondary"
              onClick={() => scrollToSection(SECTION_IDS.LATEST_POST)}
            >
              Read the latest
            </Button>
          </div>

          <p className={styles.byline}>
            Written by {SITE.authors} · {SITE.location}
          </p>
        </div>
      </Container>
    </section>
  );
}
