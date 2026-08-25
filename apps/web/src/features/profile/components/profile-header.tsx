'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, CheckCheck, Dumbbell, MapPin, Sprout, Edit2, Share2 } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { getAuthSession } from '../../../lib/auth';

import type { ProfileActionMode } from '../types';

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
  onEditProfile,
}: ProfileHeaderProps) {
  const [effectiveActionMode, setEffectiveActionMode] = useState(actionMode);

  useEffect(() => {
    const loggedUsername = getAuthSession()?.user.username;
    setEffectiveActionMode(
      actionMode === 'self' || loggedUsername === username ? 'self' : 'visitor',
    );
  }, [actionMode, username]);

  return (
    <section className="rounded-2xl border border-of-border bg-of-surface/90 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-4">
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

          <div className="min-w-0 flex-1">
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
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-of-text">
              <StatItem value={postsCount} label="publicações" />
              <StatItem value={followersCount} label="seguidores" />
              <StatItem value={followingCount} label="seguindo" />
            </div>
            {joinedLabel ? <p className="mt-1 text-sm text-of-muted">{joinedLabel}</p> : null}
          </div>
        </div>
      </div>

      {bio ? <LinkifiedBio bio={bio} /> : null}

      <div className="mt-4 space-y-3 text-sm text-of-muted">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {gymLabel ? (
            <Link
              href={gymHref ?? '#'}
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
      </div>
      <ProfileActions
        actionMode={effectiveActionMode}
        onEditProfile={onEditProfile}
        username={username}
      />
    </section>
  );
}

type StatItemProps = {
  value: string;
  label: string;
};

function StatItem({ value, label }: StatItemProps) {
  return (
    <span>
      <strong className="font-semibold text-of-text">{value}</strong>{' '}
      <span className="text-of-muted">{label}</span>
    </span>
  );
}

type ProfileActionsProps = {
  actionMode: ProfileActionMode;
  onEditProfile?: () => void;
  username: string;
};

function ProfileActions({ actionMode, onEditProfile, username }: ProfileActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeShareMenu(event: MouseEvent) {
      if (!shareRef.current?.contains(event.target as Node)) setShareOpen(false);
    }
    document.addEventListener('mousedown', closeShareMenu);
    return () => document.removeEventListener('mousedown', closeShareMenu);
  }, []);

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopied(true);
      setShareOpen(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (actionMode === 'visitor') {
    return (
      <div className="mt-5 flex w-full items-center gap-2 border-t border-of-border pt-4">
        <button
          type="button"
          className="flex-1 rounded-lg bg-of-primary px-3 py-2 text-sm font-semibold text-white hover:bg-of-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
        >
          Seguir
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg border border-of-border px-3 py-2 text-sm text-of-text hover:bg-white/10"
        >
          Mensagem
        </button>
        <ShareMenu
          ref={shareRef}
          copied={copied}
          open={shareOpen}
          onToggle={() => setShareOpen((value) => !value)}
          onCopy={copyProfileLink}
        />
      </div>
    );
  }

  return (
    <div className="mt-5 flex w-full items-center gap-2 border-t border-of-border pt-4">
      {onEditProfile ? (
        <button
          type="button"
          onClick={onEditProfile}
          aria-label="Editar perfil"
          title="Editar perfil"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-of-border px-3 py-2 text-sm font-medium text-of-text hover:bg-white/5"
        >
          <Edit2 className="h-4 w-4" />
          Editar perfil
        </button>
      ) : (
        <Link
          href="/profile?edit=1"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-of-border px-3 py-2 text-sm font-medium text-of-text hover:bg-white/5"
        >
          <Edit2 className="h-4 w-4" />
          Editar perfil
        </Link>
      )}

      <ShareMenu
        ref={shareRef}
        copied={copied}
        open={shareOpen}
        onToggle={() => setShareOpen((value) => !value)}
        onCopy={copyProfileLink}
      />
    </div>
  );
}

const ShareMenu = forwardRef<
  HTMLDivElement,
  { copied: boolean; open: boolean; onToggle: () => void; onCopy: () => void }
>(function ShareMenu({ copied, open, onToggle, onCopy }, ref) {
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Compartilhar perfil"
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${copied ? 'border-of-primary/50 text-of-primary' : 'border-of-border text-of-text hover:bg-white/5'}`}
      >
        {copied ? <CheckCheck className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{copied ? 'Copiado' : 'Compartilhar'}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-30 mb-2 w-44 rounded-xl border border-of-border bg-[#171717] p-1.5 shadow-2xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onCopy}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
          >
            <Share2 className="h-4 w-4" />
            Copiar link
          </button>
        </div>
      ) : null}
    </div>
  );
});

function LinkifiedBio({ bio }: { bio: string }) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return (
    <p className="mt-4 whitespace-pre-wrap text-base text-of-text">
      {bio.split(urlPattern).map((part, index) =>
        part.startsWith('http://') || part.startsWith('https://') ? (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="break-all text-of-primary hover:underline"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </p>
  );
}
