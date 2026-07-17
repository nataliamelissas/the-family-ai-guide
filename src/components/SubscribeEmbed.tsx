import { SITE } from "@/config/site";
import styles from "./SubscribeEmbed.module.css";

const EMBED_TITLE = `Subscribe to ${SITE.name}`;

/** Substack's official subscribe embed. */
export function SubscribeEmbed() {
  return (
    <div className={styles.wrapper}>
      <iframe
        src={SITE.substack.embedUrl}
        title={EMBED_TITLE}
        className={styles.frame}
        scrolling="no"
        loading="lazy"
      />
      <p className={styles.fallback}>
        Trouble with the form?{" "}
        <a href={SITE.substack.baseUrl} target="_blank" rel="noopener noreferrer">
          Subscribe on Substack
        </a>
        .
      </p>
    </div>
  );
}
