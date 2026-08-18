import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function OFCard({ children }: PropsWithChildren) {
  return <div className="rounded-2xl border border-of-border bg-of-surface p-4">{children}</div>;
}

export function OFButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-of-primary px-3 py-2 text-sm font-semibold text-of-text transition hover:bg-of-primaryHover ${props.className ?? ""}`}
    />
  );
}

export function OFAvatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-10 w-10 rounded-full object-cover" />;
}
