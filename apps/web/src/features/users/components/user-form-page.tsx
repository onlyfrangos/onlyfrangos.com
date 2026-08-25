"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "../../../components/layout/app-shell";
import { apiFetch, getAuthSession } from "../../../lib/auth";
import { LocationSelects } from "../../locations/location-selects";
import { ProfileMobileNavigation, ProfileSidebar } from "../../profile/components/profile-sidebar";
import type { AdminUser } from "../types";

const inputClass =
  "w-full rounded-xl border border-of-border bg-black/20 px-3 py-2.5 text-sm text-of-text outline-none focus:border-of-primary focus:ring-2 focus:ring-of-primary/20";

export function UserFormPage({ userId }: { userId?: string }) {
  const router = useRouter();
  const session = getAuthSession();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    age: "",
    stateId: "",
    cityId: "",
    isAdmin: false
  });
  const [loading, setLoading] = useState(Boolean(userId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user.isAdmin) {
      router.replace("/feed");
      return;
    }
    if (!userId) return;
    void apiFetch(`/users/admin/${userId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Usuário não encontrado");
        return response.json() as Promise<AdminUser>;
      })
      .then((user) =>
        setForm({
          name: user.name,
          username: user.username,
          email: user.email,
          password: "",
          age: String(user.age ?? ""),
          stateId: String(user.stateId ?? ""),
          cityId: String(user.cityId ?? ""),
          isAdmin: user.isAdmin
        })
      )
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "Erro ao carregar")
      )
      .finally(() => setLoading(false));
  }, [router, session?.user.isAdmin, userId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await apiFetch(userId ? `/users/admin/${userId}` : "/users/admin", {
        method: userId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          ...(form.password ? { password: form.password } : {}),
          age: form.age ? Number(form.age) : null,
          cityId: form.cityId ? Number(form.cityId) : null,
          isAdmin: form.isAdmin
        })
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        throw new Error(
          Array.isArray(payload?.message)
            ? payload.message[0]
            : (payload?.message ?? "Não foi possível salvar")
        );
      }
      router.push("/users");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  }

  const username = session?.user.username ?? "usuario";
  return (
    <AppShell
      leftAside={<ProfileSidebar username={username} />}
      mobileNavigation={<ProfileMobileNavigation username={username} />}
    >
      <section className="w-full rounded-2xl border border-of-border bg-of-surface/90 p-5 sm:p-7">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-of-muted hover:text-of-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="mt-5 font-[var(--font-heading)] text-4xl tracking-wide">
          {userId ? "Editar usuário" : "Cadastrar usuário"}
        </h1>
        <p className="mt-1 text-sm text-of-muted">
          {userId
            ? "Atualize os dados e permissões da conta."
            : "Crie uma nova conta para a comunidade."}
        </p>
        {loading ? (
          <p className="mt-8 text-sm text-of-muted">Carregando...</p>
        ) : (
          <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Nome completo" wide>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={inputClass}
                minLength={2}
                maxLength={30}
                required
              />
              <span className="mt-1 block text-right text-xs text-of-muted">{form.name.length}/30</span>
            </Field>
            <Field label="Nome de usuário">
              <input
                value={form.username}
                onChange={(event) =>
                  setForm({
                    ...form,
                    username: event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "")
                  })
                }
                className={inputClass}
                minLength={3}
                maxLength={30}
                required
              />
              <span className="mt-1 block text-right text-xs text-of-muted">{form.username.length}/30</span>
            </Field>
            <Field label="Idade">
              <input
                type="number"
                value={form.age}
                onChange={(event) => setForm({ ...form, age: event.target.value })}
                className={inputClass}
                min={13}
                max={120}
                placeholder="Opcional"
              />
            </Field>
            <Field label="E-mail" wide>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className={inputClass}
                required
              />
            </Field>
            <Field label={userId ? "Nova senha (opcional)" : "Senha"} wide>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className={inputClass}
                minLength={6}
                required={!userId}
              />
            </Field>
            <LocationSelects
              stateId={form.stateId}
              cityId={form.cityId}
              onStateChange={(stateId) => setForm({ ...form, stateId, cityId: "" })}
              onCityChange={(cityId) => setForm({ ...form, cityId })}
              className={inputClass}
            />
            <label className="flex items-center gap-3 rounded-xl border border-of-border bg-black/15 p-4 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(event) => setForm({ ...form, isAdmin: event.target.checked })}
                className="h-4 w-4 accent-red-600"
              />
              <span>
                <strong className="block text-sm">Administrador</strong>
                <span className="text-xs text-of-muted">
                  Permite gerenciar usuários e academias.
                </span>
              </span>
            </label>
            {error ? (
              <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400 sm:col-span-2">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Link
                href="/users"
                className="rounded-xl border border-of-border px-4 py-2.5 text-sm hover:bg-white/5"
              >
                Cancelar
              </Link>
              <button
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-of-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar usuário"}
              </button>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  );
}

function Field({
  label,
  wide,
  children
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
