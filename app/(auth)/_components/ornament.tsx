type OrnamentProps = {
  className?: string;
  variant?: "rule" | "diamond";
};

export function Ornament({ className, variant = "rule" }: OrnamentProps) {
  if (variant === "diamond") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="currentColor"
      >
        <path d="M12 1.5l3.2 4.6L20 9l-4.8 2.9L12 22.5 8.8 11.9 4 9l4.8-2.9z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 12"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <line x1="0" y1="6" x2="78" y2="6" />
      <path d="M78 6 q5 -4 10 0 q5 4 10 0" />
      <circle cx="100" cy="6" r="2.2" fill="currentColor" stroke="none" />
      <path d="M102 6 q5 -4 10 0 q5 4 10 0" />
      <line x1="122" y1="6" x2="200" y2="6" />
    </svg>
  );
}
