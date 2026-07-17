import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostPreview } from "@/components/PostPreview";
import type { Post } from "@/types/content";

const POST: Post = {
  id: "https://thefamilyaiguide.substack.com/p/when-ai-comes-home",
  title: "When AI Comes Home",
  url: "https://thefamilyaiguide.substack.com/p/when-ai-comes-home",
  publishedAt: "2026-06-19T12:00:00.000Z",
  excerpt: "Smart bassinets, AI tutors, and the question every parent faces.",
};

describe("PostPreview", () => {
  it("renders the title, excerpt, and formatted date", () => {
    render(<PostPreview post={POST} />);

    expect(screen.getByText(POST.title)).toBeInTheDocument();
    expect(screen.getByText(POST.excerpt)).toBeInTheDocument();
    expect(screen.getByText("June 19, 2026")).toBeInTheDocument();
  });

  it("links the title to the post on Substack", () => {
    render(<PostPreview post={POST} />);

    expect(screen.getByRole("link", { name: POST.title })).toHaveAttribute(
      "href",
      POST.url,
    );
  });

  it("opens external links safely in a new tab", () => {
    render(<PostPreview post={POST} />);

    const readMore = screen.getByRole("link", { name: /Read the full post/ });

    expect(readMore).toHaveAttribute("href", POST.url);
    expect(readMore).toHaveAttribute("target", "_blank");
    expect(readMore).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("names the read-more link with the post title for screen readers", () => {
    render(<PostPreview post={POST} />);

    expect(
      screen.getByRole("link", { name: /Read the full post.*When AI Comes Home/ }),
    ).toBeInTheDocument();
  });

  it("exposes the machine-readable publish date", () => {
    const { container } = render(<PostPreview post={POST} />);

    expect(container.querySelector("time")).toHaveAttribute(
      "dateTime",
      POST.publishedAt,
    );
  });
});
