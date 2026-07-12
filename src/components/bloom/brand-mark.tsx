'use client'

export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="15" cy="15" r="14" fill="#7C9473" />
      <path d="M15 8c1.5 2 1.5 4 0 6-1.5-2-1.5-4 0-6z" fill="#EFB94A" />
      <path d="M9 15c2-1.5 4-1.5 6 0-2 1.5-4 1.5-6 0z" fill="#B23A52" />
      <path d="M21 15c-2-1.5-4-1.5-6 0 2 1.5 4 1.5 6 0z" fill="#B23A52" />
      <circle cx="15" cy="15" r="2.4" fill="#FAF6F0" />
    </svg>
  )
}