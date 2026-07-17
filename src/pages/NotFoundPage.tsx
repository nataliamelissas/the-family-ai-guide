import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ROUTES } from "@/config/routes";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <Section
      eyebrow="404"
      title="We couldn't find that page"
      description="The link may be old, or the page may have moved."
      width="narrow"
    >
      <Button to={ROUTES.HOME} className={styles.action}>
        Back to home
      </Button>
    </Section>
  );
}
