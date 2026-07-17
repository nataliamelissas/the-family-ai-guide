import { MapPin } from "lucide-react";
import { classNames } from "@/lib/classNames";
import type { EventItem } from "@/types/content";
import styles from "./EventLocation.module.css";

interface EventLocationProps {
  event: Pick<EventItem, "location" | "locationUrl">;
  className?: string | undefined;
  /**
   * Whether to link the location to its map URL. Off in the banner, where RSVP
   * is meant to be the only call to action.
   */
  link?: boolean;
}

/**
 * Renders an event's location behind a map pin, linking it (e.g. to a map)
 * when a URL is set and `link` isn't disabled. Shared so the venue reads the
 * same way in the card, banner, and RSVP dialog. Renders nothing when there is
 * no location.
 */
export function EventLocation({
  event,
  className,
  link = true,
}: EventLocationProps) {
  if (!event.location) {
    return null;
  }

  const content = (
    <>
      <MapPin className={styles.icon} size="1em" aria-hidden="true" />
      {event.location}
    </>
  );

  if (!link || !event.locationUrl) {
    return (
      <span className={classNames(styles.root, className)}>{content}</span>
    );
  }

  return (
    <a
      className={classNames(styles.root, className)}
      href={event.locationUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}
