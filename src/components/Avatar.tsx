import { classNames } from "@/lib/classNames";
import styles from "./Avatar.module.css";

const MAX_INITIALS = 2;

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string | undefined;
}

function toInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** Shows a photo when available, otherwise an initials monogram. */
export function Avatar({ name, photoUrl, className }: AvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={classNames(styles.avatar, styles.photo, className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={classNames(styles.avatar, styles.monogram, className)}
      aria-hidden="true"
    >
      {toInitials(name)}
    </div>
  );
}
