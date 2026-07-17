import type { ReactNode } from "react";
import { EventBanner } from "@/components/EventBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RsvpDialog } from "@/components/RsvpDialog";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <EventBanner />
      <main className={styles.main}>{children}</main>
      <Footer />
      <RsvpDialog />
    </div>
  );
}
