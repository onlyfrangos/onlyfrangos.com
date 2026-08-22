import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import type { GymCardData } from "../types";

type GymCardProps = {
  gym: GymCardData;
};

export function GymCard({ gym }: GymCardProps) {
  return (
    <section className="rounded-2xl border border-of-border bg-of-surface/90 p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-of-border bg-of-surface">
          {gym.logoUrl ? <Image src={gym.logoUrl} alt={gym.name} fill className="object-cover" sizes="48px" /> : null}
        </div>
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-of-text">
            {gym.name}
            <CheckCircle2 className="h-4 w-4 text-red-500" />
          </p>
          {gym.addressLine1 ? <p className="mt-1 text-xs text-of-muted">{gym.addressLine1}</p> : null}
          {gym.addressLine2 ? <p className="text-xs text-of-muted">{gym.addressLine2}</p> : null}
        </div>
      </div>

      {gym.memberCountLabel ? <p className="mt-3 text-xs text-of-muted">{gym.memberCountLabel}</p> : null}

      {gym.members.length > 0 ? (
        <div className="mt-3 flex items-center">
          {gym.members.map((member, index) => (
            <div
              key={member.id}
              className="relative h-7 w-7 overflow-hidden rounded-full border border-of-surface"
              style={{ marginLeft: index === 0 ? 0 : -8 }}
              title={member.name}
            >
              <Image src={member.avatarUrl} alt={member.name} fill className="object-cover" sizes="28px" />
            </div>
          ))}
        </div>
      ) : null}

      <Link
        href={gym.ctaHref}
        className="mt-4 inline-flex w-full justify-center rounded-xl border border-of-border px-3 py-2 text-sm text-of-text hover:bg-white/10"
      >
        {gym.ctaLabel}
      </Link>
    </section>
  );
}
