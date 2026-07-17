const SUBSTACK_BASE_URL = "https://thefamilyaiguide.substack.com";

export const SITE = {
  name: "The Family AI Guide",
  tagline: "Raising steady families in the age of AI",
  mission:
    "Kids are growing up with AI. We help parents and families meet that with curiosity instead of fear, grounded in real research, and always pointing back to agency, connection, and wonder.",
  location: "Davis County, Utah",
  authors: "Katherine & Natalia",

  substack: {
    baseUrl: SUBSTACK_BASE_URL,
    feedUrl: `${SUBSTACK_BASE_URL}/feed`,
    embedUrl: `${SUBSTACK_BASE_URL}/embed`,
    archiveUrl: `${SUBSTACK_BASE_URL}/archive`,
    notesUrl: "https://substack.com/@thefamilyaiguide",
  },

  contactEmail: "thefamilyaiguide@gmail.com",
} as const;
