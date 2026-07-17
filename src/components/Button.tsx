import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { classNames } from "@/lib/classNames";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string | undefined;
}

/**
 * A button is exactly one of: an internal route (`to`), an external link
 * (`href`), or an in-page action (`onClick`). In-page scrolling uses `onClick`
 * rather than an "#id" anchor because HashRouter owns the URL hash.
 */
type ButtonProps = ButtonBaseProps &
  (
    | { to: string; href?: never; onClick?: never }
    | { href: string; to?: never; onClick?: never }
    | { onClick: () => void; to?: never; href?: never }
  );

export function Button({
  children,
  variant = "primary",
  className,
  ...target
}: ButtonProps) {
  const buttonClass = classNames(styles.button, styles[variant], className);

  if (target.to !== undefined) {
    return (
      <Link to={target.to} className={buttonClass}>
        {children}
      </Link>
    );
  }

  if (target.href !== undefined) {
    return (
      <a
        href={target.href}
        className={buttonClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={target.onClick} className={buttonClass}>
      {children}
    </button>
  );
}
