import { EventCard } from "@/components/EventCard";
import { Hero } from "@/components/Hero";
import { NoteCard } from "@/components/NoteCard";
import { PostPreview } from "@/components/PostPreview";
import { Section } from "@/components/Section";
import { SubscribeEmbed } from "@/components/SubscribeEmbed";
import { SECTION_IDS } from "@/config/sections";
import { SITE } from "@/config/site";
import { EVENTS } from "@/content/events";
import { LATEST_NOTE } from "@/content/latestNote";
import { LATEST_POST } from "@/content/posts";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <>
      <Hero />

      {LATEST_POST && (
        <Section
          id={SECTION_IDS.LATEST_POST}
          eyebrow="The newsletter"
          title="Latest from the guide"
          description="One post a week, grounded in real research, and always pointing back to the conversation at your kitchen table."
          tone="warm"
        >
          <PostPreview post={LATEST_POST} />
          <a
            href={SITE.substack.archiveUrl}
            className={styles.moreLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse every post
            <span aria-hidden="true"> →</span>
          </a>
        </Section>
      )}

      <Section
        id={SECTION_IDS.NOTE}
        eyebrow="Notes"
        title="A thought we're sitting with"
        description="Shorter thinking between the weekly posts."
      >
        <NoteCard note={LATEST_NOTE} />
        <a
          href={SITE.substack.notesUrl}
          className={styles.moreLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          See all our notes
          <span aria-hidden="true"> →</span>
        </a>
      </Section>

      {EVENTS.length > 0 && (
        <Section
          id={SECTION_IDS.EVENTS}
          eyebrow="Events"
          title="Where you can find us"
          tone="warm"
        >
          <ul className={styles.eventList}>
            {EVENTS.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        id={SECTION_IDS.SUBSCRIBE}
        eyebrow="Stay with us"
        title="Never miss a post"
        description="Free, weekly, and written by two people who care deeply about families."
        width="narrow"
        align="center"
      >
        <SubscribeEmbed />
      </Section>
    </>
  );
}
