interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className = "h-4 w-4" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.6 7.4 12 3.2l8.4 4.2L12 11.6 3.6 7.4Z" fill="currentColor" opacity="0.32" />
      <path
        d="M7 11.4c.3 3.9 2 7 5 9.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 11.8v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M17 11.4c-.3 3.9-2 7-5 9.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
