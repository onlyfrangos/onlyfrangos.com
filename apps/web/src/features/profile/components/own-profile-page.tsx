"use client";

import type { UserPost, UserProfile } from "@onlyfrangos/types";
import { CalendarDays, Dumbbell, Mail, MapPin, Target, UserRound } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "../../../components/layout/app-shell";
import { CustomSelect } from "../../../components/ui/custom-select";
import { apiFetch, updateAuthUser } from "../../../lib/auth";
import { resolveAvatarUrl } from "../../../lib/avatar";
import { LocationSelects } from "../../locations/location-selects";

import { ProfileHeader } from "./profile-header";
import { ProfileMobileNavigation, ProfileSidebar } from "./profile-sidebar";
import { ProfilePostGrid } from "./profile-post-grid";
import { ProfileTabs } from "./profile-tabs";
import { ProfileTopBar } from "./profile-top-bar";

type OwnProfile = UserProfile & {
  email: string;
  isAdmin: boolean;
  profile: UserProfile["profile"] & {
    age: number | null;
    cityId: number | null;
    stateId: number | null;
    state: string | null;
    gymId: string | null;
    showGym: boolean;
    showCity: boolean;
    showPhysicalInfo: boolean;
  };
};

type GymOption = { id: string; name: string; city: string; state: string; imageUrl: string };

type EditForm = {
  name: string;
  username: string;
  email: string;
  age: string;
  stateId: string;
  cityId: string;
  bio: string;
  gymId: string;
  fitnessGoal: string;
  weight: string;
  bodyFat: string;
  arm: string;
  showGym: boolean;
  showCity: boolean;
  showPhysicalInfo: boolean;
};

export function OwnProfilePage() {
  const searchParams = useSearchParams();
  const shouldOpenEditor = searchParams.get("edit") === "1";
  const [profile, setProfile] = useState<OwnProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gyms, setGyms] = useState<GymOption[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const profileResponse = await apiFetch("/users/me");
        if (!profileResponse.ok) throw new Error("Não foi possível carregar seu perfil");
        const nextProfile = (await profileResponse.json()) as OwnProfile;
        const postsResponse = await apiFetch(
          `/users/${encodeURIComponent(nextProfile.username)}/posts`
        );
        const nextPosts = postsResponse.ok ? ((await postsResponse.json()) as UserPost[]) : [];

        if (active) {
          setProfile(nextProfile);
          setPosts(nextPosts);
          if (shouldOpenEditor) {
            setForm(createEditForm(nextProfile));
            setEditing(true);
          }
        }
      } catch (requestError) {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar seu perfil"
          );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [shouldOpenEditor]);

  useEffect(() => {
    if (!editing || !form?.cityId) {
      setGyms([]);
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      const response = await apiFetch(`/gyms?cityId=${form.cityId}`).catch(() => null);
      if (active && response?.ok) {
        const payload = (await response.json()) as { items: GymOption[] };
        setGyms(payload.items);
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [editing, form?.cityId]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl(null);
      return;
    }
    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  function openEditor() {
    if (!profile) return;
    setForm(createEditForm(profile));
    setAvatarFile(null);
    setError(null);
    setEditing(true);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !form) return;
    setSaving(true);
    setError(null);

    try {
      const response = await apiFetch("/users/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          age: form.age ? Number(form.age) : null,
          cityId: form.cityId ? Number(form.cityId) : null,
          bio: form.bio,
          gymId: form.gymId || null,
          fitnessGoal: form.fitnessGoal,
          weight: form.weight,
          bodyFat: form.bodyFat,
          arm: form.arm,
          showGym: form.showGym,
          showCity: form.showCity,
          showPhysicalInfo: form.showPhysicalInfo
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
        throw new Error(message ?? "Não foi possível salvar o perfil");
      }

      let updatedProfile = (await response.json()) as OwnProfile;

      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatarFile);
        const avatarResponse = await apiFetch("/users/me/avatar", {
          method: "POST",
          body: avatarData
        });
        if (!avatarResponse.ok)
          throw new Error("Os dados foram salvos, mas não foi possível enviar a foto");
        const avatar = (await avatarResponse.json()) as { avatarUrl: string };
        updatedProfile = { ...updatedProfile, avatarUrl: avatar.avatarUrl };
      }
      setProfile(updatedProfile);
      updateAuthUser({
        id: updatedProfile.id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        isAdmin: updatedProfile.isAdmin
      });
      setEditing(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Não foi possível salvar o perfil"
      );
    } finally {
      setSaving(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("edit");

      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center text-sm text-of-muted">
        Carregando seu perfil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-of-border bg-of-surface p-8 text-center text-red-400">
        {error ?? "Não foi possível carregar seu perfil."}
      </div>
    );
  }

  const postItems = posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    imageUrl: post.imageUrl,
    imageUrls: post.imageUrls,
    createdAtLabel: formatDateLabel(post.createdAt),
    createdAt: post.createdAt,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    hashtags: [profile.username]
  }));

  return (
    <AppShell
      leftAside={<ProfileSidebar username={profile.username} />}
      mobileNavigation={<ProfileMobileNavigation username={profile.username} />}
      rightAside={
        <aside className="sticky top-6 rounded-2xl border border-of-border bg-of-surface/90 p-5">
          <h2 className="font-semibold text-of-text">Sobre você</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <ProfileDetail icon={Mail} label="E-mail" value={profile.email} />
            <ProfileDetail
              icon={UserRound}
              label="Idade"
              value={profile.profile.age ? `${profile.profile.age} anos` : "Não informada"}
            />
            <ProfileDetail
              icon={CalendarDays}
              label="Na comunidade desde"
              value={formatJoinedDate(profile.createdAt)}
            />
            <ProfileDetail
              icon={MapPin}
              label="Cidade"
              value={profile.profile.city ?? "Não informada"}
            />
            <ProfileDetail
              icon={Dumbbell}
              label="Academia"
              value={profile.profile.gym ?? "Não informada"}
              href={profile.profile.gymId ? `/gyms/${profile.profile.gymId}` : undefined}
            />
            <ProfileDetail
              icon={Target}
              label="Objetivo"
              value={profile.profile.fitnessGoal ?? "Não informado"}
            />
          </dl>
        </aside>
      }
      rightAsideClassName="border-none bg-transparent p-0"
    >
      <ProfileTopBar />
      <ProfileHeader
        username={profile.username}
        name={profile.name}
        bio={profile.bio}
        joinedLabel={`Entrou em ${formatJoinedDate(profile.createdAt)}`}
        avatarUrl={resolveAvatarUrl(profile.avatarUrl, profile.username)}
        gymLabel={profile.profile.gym ?? undefined}
        gymHref={profile.profile.gymId ? `/gyms/${profile.profile.gymId}` : undefined}
        cityLabel={profile.profile.city ?? undefined}
        postsCount={formatCompactCount(profile.postCount)}
        followersCount={formatCompactCount(profile.followersCount)}
        followingCount={formatCompactCount(profile.followingCount)}
        actionMode="self"
        onEditProfile={openEditor}
      />

      <section className="mt-4 rounded-2xl border border-of-border bg-of-surface/90 p-4 lg:hidden">
        <h2 className="font-semibold text-of-text">Seus dados</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <ProfileDetail icon={Mail} label="E-mail" value={profile.email} />
          <ProfileDetail
            icon={UserRound}
            label="Idade"
            value={profile.profile.age ? `${profile.profile.age} anos` : "Não informada"}
          />
          <ProfileDetail
            icon={CalendarDays}
            label="Desde"
            value={formatJoinedDate(profile.createdAt)}
          />
          <ProfileDetail
            icon={MapPin}
            label="Cidade"
            value={profile.profile.city ?? "Não informada"}
          />
        </dl>
      </section>

      <ProfileTabs items={[{ id: "posts", label: "Publicações" }]} activeTab="posts" />
      <ProfilePostGrid
        posts={postItems}
        username={profile.username}
        avatarUrl={resolveAvatarUrl(profile.avatarUrl, profile.username)}
        canManage
      />

      {editing && form ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setEditing(false);
          }}
        >
          <form
            onSubmit={saveProfile}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-of-border bg-of-surface p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-profile-title" className="text-xl font-semibold text-of-text">
                  Editar perfil
                </h2>
                <p className="mt-1 text-sm text-of-muted">
                  Atualize os dados exibidos na sua conta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg px-2 py-1 text-of-muted hover:bg-white/5 hover:text-of-text"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <EditField label="Foto do perfil" className="sm:col-span-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                  className="block w-full rounded-xl border border-dashed border-of-border bg-black/20 p-3 text-sm text-of-muted file:mr-3 file:rounded-lg file:border-0 file:bg-of-primary file:px-3 file:py-2 file:font-semibold file:text-white"
                />
                {avatarPreviewUrl ? (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-of-border bg-black/15 p-3">
                    <Image
                      src={avatarPreviewUrl}
                      alt="Prévia da nova foto do perfil"
                      width={72}
                      height={72}
                      unoptimized
                      className="h-[72px] w-[72px] rounded-full object-cover"
                    />
                    <span className="text-sm text-of-muted">Prévia da foto selecionada</span>
                  </div>
                ) : null}
                <span className="mt-1 block text-xs text-of-muted">
                  JPG, PNG ou WebP, até 5 MB.
                </span>
              </EditField>
              <EditField label="Nome completo" className="sm:col-span-2">
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  minLength={2}
                  maxLength={30}
                  required
                  className={inputClassName}
                />
                <span className="mt-1 block text-right text-xs text-of-muted">
                  {form.name.length}/30
                </span>
              </EditField>
              <EditField label="Nome de usuário">
                <input
                  value={form.username}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      username: event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "")
                    })
                  }
                  minLength={3}
                  maxLength={30}
                  pattern="[a-z0-9._]+"
                  required
                  className={inputClassName}
                />
                <span className="mt-1 block text-right text-xs text-of-muted">
                  {form.username.length}/30
                </span>
              </EditField>
              <EditField label="Idade">
                <input
                  type="number"
                  value={form.age}
                  onChange={(event) => setForm({ ...form, age: event.target.value })}
                  min={13}
                  max={120}
                  placeholder="Opcional"
                  className={inputClassName}
                />
              </EditField>
              <EditField label="E-mail" className="sm:col-span-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                  className={inputClassName}
                />
              </EditField>
              <LocationSelects
                stateId={form.stateId}
                cityId={form.cityId}
                onStateChange={(stateId) => setForm({ ...form, stateId, cityId: "", gymId: "" })}
                onCityChange={(cityId) => setForm({ ...form, cityId, gymId: "" })}
                className={inputClassName}
              />
              <EditField label="Academia" className="sm:col-span-2">
                <CustomSelect
                  value={form.gymId}
                  onChange={(gymId) => setForm({ ...form, gymId })}
                  options={[
                    { value: "", label: "Nenhuma academia" },
                    ...gyms.map((gym) => ({
                      value: gym.id,
                      label: `${gym.name} — ${gym.city}/${gym.state}`,
                      imageUrl: gym.imageUrl
                    }))
                  ]}
                  placeholder="Nenhuma academia"
                  ariaLabel="Academia"
                  className={inputClassName}
                  disabled={!form.cityId}
                />
                <span className="mt-1 block text-xs text-of-muted">
                  São exibidas apenas academias da cidade informada.
                </span>
              </EditField>
              <EditField label="Bio" className="sm:col-span-2">
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  maxLength={150}
                  rows={4}
                  className={`${inputClassName} resize-none`}
                />
                <span className="mt-1 block text-right text-xs text-of-muted">
                  {form.bio.length}/150
                </span>
              </EditField>
              <EditField label="Objetivo" className="sm:col-span-2">
                <input
                  value={form.fitnessGoal}
                  onChange={(event) => setForm({ ...form, fitnessGoal: event.target.value })}
                  maxLength={100}
                  placeholder="Ex.: ganhar massa muscular"
                  className={inputClassName}
                />
              </EditField>
              <EditField label="Peso">
                <input
                  value={form.weight}
                  onChange={(event) => setForm({ ...form, weight: event.target.value })}
                  maxLength={30}
                  placeholder="Ex.: 78 kg"
                  className={inputClassName}
                />
              </EditField>
              <EditField label="Gordura corporal">
                <input
                  value={form.bodyFat}
                  onChange={(event) => setForm({ ...form, bodyFat: event.target.value })}
                  maxLength={30}
                  placeholder="Ex.: 15%"
                  className={inputClassName}
                />
              </EditField>
              <EditField label="Medida de braço" className="sm:col-span-2">
                <input
                  value={form.arm}
                  onChange={(event) => setForm({ ...form, arm: event.target.value })}
                  maxLength={30}
                  placeholder="Ex.: 38 cm"
                  className={inputClassName}
                />
              </EditField>

              <fieldset className="space-y-3 rounded-xl border border-of-border bg-black/10 p-4 sm:col-span-2">
                <legend className="px-1 text-sm font-medium text-of-text">
                  Privacidade do perfil
                </legend>
                <Checkbox
                  label="Mostrar academia no perfil"
                  checked={form.showGym}
                  onChange={(checked) => setForm({ ...form, showGym: checked })}
                />
                <Checkbox
                  label="Mostrar cidade no perfil"
                  checked={form.showCity}
                  onChange={(checked) => setForm({ ...form, showCity: checked })}
                />
                <Checkbox
                  label="Mostrar informações físicas no perfil"
                  checked={form.showPhysicalInfo}
                  onChange={(checked) => setForm({ ...form, showPhysicalInfo: checked })}
                />
              </fieldset>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
              >
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-of-border px-4 py-2.5 text-sm text-of-text hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-of-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-of-primaryHover disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}

const inputClassName =
  "w-full rounded-xl border border-of-border bg-black/20 px-3 py-2.5 text-sm text-of-text outline-none transition focus:border-of-primary focus:ring-2 focus:ring-of-primary/20";

function createEditForm(profile: OwnProfile): EditForm {
  return {
    name: profile.name,
    username: profile.username,
    email: profile.email,
    age: profile.profile.age?.toString() ?? "",
    stateId: profile.profile.stateId?.toString() ?? "",
    cityId: profile.profile.cityId?.toString() ?? "",
    bio: profile.bio,
    gymId: profile.profile.gymId ?? "",
    fitnessGoal: profile.profile.fitnessGoal ?? "",
    weight: profile.profile.physicalInfo?.weight ?? "",
    bodyFat: profile.profile.physicalInfo?.bodyFat ?? "",
    arm: profile.profile.physicalInfo?.arm ?? "",
    showGym: profile.profile.showGym,
    showCity: profile.profile.showCity,
    showPhysicalInfo: profile.profile.showPhysicalInfo
  };
}

function EditField({
  label,
  className,
  children
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-of-text">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-of-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-red-600"
      />
      {label}
    </label>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-of-primary" />
      <div className="min-w-0">
        <dt className="text-xs text-of-muted">{label}</dt>
        <dd className="break-words text-of-text">
          {href ? (
            <Link href={href} className="hover:text-of-primary">
              {value}
            </Link>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

function formatCompactCount(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

function formatJoinedDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recente"
    : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
