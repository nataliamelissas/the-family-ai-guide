/** A newsletter post, generated from the Substack RSS feed at build time. */
export interface Post {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
}

/** The shape of the build-time generated posts file. */
export interface GeneratedPosts {
  fetchedAt: string;
  posts: Post[];
}

/**
 * A Substack Note. Substack exposes no public API or RSS feed for Notes, so
 * this is maintained by hand rather than generated.
 */
export interface Note {
  body: string;
  publishedAt: string;
}

/** An upcoming event. */
export interface EventItem {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string | null;
  registrationUrl: string | null;
}

/** One of the guide's founders, shown on the About page. */
export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  linkedInUrl: string | null;
  /** Falls back to an initials monogram when no photo is set. */
  photoUrl: string | null;
}
