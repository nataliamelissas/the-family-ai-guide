import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/* jsdom implements no layout, so scrolling APIs are absent. */
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

/*
 * jsdom ships <dialog> without its methods. These stubs only toggle the `open`
 * attribute: enough for visibility assertions, but the top layer, focus trap,
 * and backdrop are the platform's and go untested here.
 */
HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};

HTMLDialogElement.prototype.close = function close() {
  this.open = false;
  this.dispatchEvent(new Event("close"));
};

afterEach(() => {
  cleanup();
});
