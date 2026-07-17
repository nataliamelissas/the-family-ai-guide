import { formatShortDate } from "@/lib/date";
import type { Note } from "@/types/content";
import styles from "./NoteCard.module.css";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <figure className={styles.card}>
      <blockquote className={styles.body}>{note.body}</blockquote>
      <figcaption className={styles.meta}>
        <time dateTime={note.publishedAt}>
          {formatShortDate(note.publishedAt)}
        </time>
      </figcaption>
    </figure>
  );
}
