import { formatShortDate } from "@/lib/date";
import type { Post } from "@/types/content";
import styles from "./PostPreview.module.css";

interface PostPreviewProps {
  post: Post;
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <article className={styles.card}>
      <time className={styles.date} dateTime={post.publishedAt}>
        {formatShortDate(post.publishedAt)}
      </time>

      <h3 className={styles.title}>
        <a
          href={post.url}
          className={styles.titleLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {post.title}
        </a>
      </h3>

      <p className={styles.excerpt}>{post.excerpt}</p>

      <a
        href={post.url}
        className={styles.readMore}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read the full post
        <span aria-hidden="true"> →</span>
        <span className="visually-hidden">: {post.title}</span>
      </a>
    </article>
  );
}
