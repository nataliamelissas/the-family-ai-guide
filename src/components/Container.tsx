import type { ReactNode } from "react";
import { classNames } from "@/lib/classNames";
import styles from "./Container.module.css";

type ContainerWidth = "default" | "narrow";

interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string | undefined;
}

export function Container({
  children,
  width = "default",
  className,
}: ContainerProps) {
  return (
    <div className={classNames(styles.container, styles[width], className)}>
      {children}
    </div>
  );
}
