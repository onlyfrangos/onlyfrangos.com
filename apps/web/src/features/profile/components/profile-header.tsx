"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Dumbbell, MapPin, Sprout, Edit2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getAuthSession } from "../../../lib/auth";

import type { ProfileActionMode } from "../types";

type ProfileHeaderProps = {
  username: string;
  name: string;
  bio?: string;
  joinedLabel?: string;
  avatarUrl: string;
  verified?: boolean;
  gymLabel?: string;
  gymHref?: string;
  cityLabel?: string;
  naturalLabel?: string;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  actionMode: ProfileActionMode;
  onEditProfile?: () => void;
};

export function ProfileHeader({
  username,
  name,
  bio,
  joinedLabel,
  avatarUrl,
  verified,
  gymLabel,
  gymHref,
  cityLabel,
  naturalLabel,
  postsCount,
  followersCount,
  followingCount,
  actionMode,
  onEditProfile
}: ProfileHeaderProps) {
  const [effectiveActionMode, setEffectiveActionMode] = useState(actionMode);

  useEffect(() => {
    const loggedUsername = getAuthSession()?.user.username;
    setEffectiveActionMode(
      actionMode === "self" || loggedUsername === username ? "self" : "visitor"
    );
  }, [actionMode, username]);

  return (
    <section className="rounded-2xl border border-of-border bg-of-surface/90 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 border-b border-of-border pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-red-500 bg-of-surface sm:h-28 sm:w-28">
            <Image
              src={avatarUrl}
              alt={`Avatar de ${name}`}
              fill
              className="object-cover"
              sizes="112px"
              draggable={false}
              priority
            />
            <span
              className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-of-surface bg-emerald-500"
              aria-hidden="true"
            />
          </div>

          <div>
            <h1 className="flex items-center gap-1 text-1xl font-semibold text-of-text sm:text-2xl">
              {name}
              {verified ? (
                <Check
                  className="h-4 w-4 rounded-full bg-red-600 p-0.5 text-white"
                  aria-label="Perfil verificado"
                />
              ) : null}
            </h1>
            <p className="mt-2 text-sm text-of-muted">@{username}</p>
            {joinedLabel ? <p className="mt-1 text-sm text-of-muted">{joinedLabel}</p> : null}
          </div>
        </div>

        <ProfileActions actionMode={effectiveActionMode} onEditProfile={onEditProfile} />
      </div>

      {bio ? <p className="mt-4 text-base text-of-text sm:text-lg">{bio}</p> : null}

      <div className="mt-4 space-y-3 text-sm text-of-muted">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {gymLabel ? (
            <Link
              href={gymHref ?? "#"}
              className="inline-flex items-center gap-1.5 hover:text-of-primary"
            >
              <Dumbbell className="h-3.5 w-3.5 text-red-400" />
              {gymLabel}
            </Link>
          ) : null}
          {cityLabel ? (
            <p className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-400" />
              {cityLabel}
            </p>
          ) : null}
          {naturalLabel ? (
            <p className="inline-flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-green-500" />
              {naturalLabel}
            </p>
          ) : null}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-3 rounded-xl border border-of-border bg-black/20 px-3 py-3 text-center sm:px-4">
          <StatItem value={postsCount} label="publicacoes" />
          <StatItem value={followersCount} label="seguidores" />
          <StatItem value={followingCount} label="seguindo" />
        </div>
      </div>
    </section>
  );
}

type StatItemProps = {
  value: string;
  label: string;
};

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <p className="text-lg font-semibold text-of-text sm:text-xl">{value}</p>
      <p className="text-xs text-of-muted sm:text-sm">{label}</p>
    </div>
  );
}

type ProfileActionsProps = {
  actionMode: ProfileActionMode;
  onEditProfile?: () => void;
};

function ProfileActions({ actionMode, onEditProfile }: ProfileActionsProps) {
  if (actionMode === "visitor") {
    return (
      <div className="mt-2 flex items-center gap-2 md:mt-0">
        <button
          type="button"
          className="rounded-lg bg-of-primary px-3 py-2 text-sm font-semibold text-white hover:bg-of-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
        >
          Seguir
        </button>
        <button
          type="button"
          className="rounded-lg border border-of-border px-3 py-2 text-sm text-of-text hover:bg-white/10"
        >
          Mensagem
        </button>
        <button
          type="button"
          aria-label="Mais opcoes"
          className="rounded-lg border border-of-border px-2 py-2 text-of-muted hover:text-of-text"
        >
          ...
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 md:mt-0">
      {onEditProfile ? (
        <button
          type="button"
          onClick={onEditProfile}
          aria-label="Editar perfil"
          title="Editar perfil"
          className="inline-flex items-center gap-2 rounded-lg border border-of-border px-3 py-2 text-sm font-medium text-of-text hover:bg-white/5"
        >
          <Edit2 className="h-4 w-4" />
          Editar perfil
        </button>
      ) : (
        <Link
          href="/profile?edit=1"
          className="inline-flex items-center gap-2 rounded-lg border border-of-border px-3 py-2 text-sm font-medium text-of-text hover:bg-white/5"
        >
          <Edit2 className="h-4 w-4" />
          Editar perfil
        </Link>
      )}

      <button
        type="button"
        aria-label="Compartilhar perfil"
        title="Compartilhar perfil"
        className="rounded-lg border border-of-border p-2 text-of-text hover:bg-white/5"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Mais opcoes"
        className="rounded-lg border border-of-border px-2 py-2 text-of-muted hover:text-of-text"
      >
        ...
      </button>
    </div>
  );
}
