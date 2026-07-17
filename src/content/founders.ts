import katherinePhoto from "@/assets/founders/katherine.jpg";
import nataliaPhoto from "@/assets/founders/natalia.jpg";
import type { Founder } from "@/types/content";

export const FOUNDERS: ReadonlyArray<Founder> = [
  {
    id: "katherine",
    name: "Katherine",
    role: "Co-founder",
    bio: "Katherine's background is in Marriage and Family Studies, and she works as a paralegal, a combination that shapes how she reads this moment. She thinks about what actually holds a family together, and she's practiced at reading the fine print the rest of us scroll past. She's raising her kids in the middle of all of this, asking the same questions you are.",
    // TODO(katherine): Add LinkedIn profile URL. The link renders only when set.
    linkedInUrl: null,
    photoUrl: katherinePhoto,
  },
  {
    id: "natalia",
    name: "Natalia",
    role: "Co-founder",
    bio: "Natalia is a software engineer who runs a local tutoring business teaching kids and teens to code, use technology, and think their way through hard problems. She's spent years watching what technology does for kids and what it does to them, and she's convinced the goal isn't keeping AI away from them, but raising kids who can handle it well.",
    // TODO(natalia): Add LinkedIn profile URL. The link renders only when set.
    linkedInUrl: null,
    photoUrl: nataliaPhoto,
  },
];

export const ABOUT_INTRO = {
  heading: "Two families asking the same questions you are",
  paragraphs: [
    "We're Katherine and Natalia, and we're based in Davis County, Utah. We started The Family AI Guide because we're both deeply passionate about two things: healthy, resilient families, and education. Kids are growing up in a world that's changing faster than anyone's advice can keep up with. We don't think the answer is fear, and we don't think it's pretending this isn't happening.",
    "We read the research, we sit with the hard questions, and we share what we find: real stories about connection, and honest, research-backed guidance for families. Not because we have it solved, but because these are the questions we're living too.",
  ],
} as const;
