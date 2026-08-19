"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser, registerUser } from "../../../lib/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        await registerUser({
          username: form.username,
          email: form.email,
          password: form.password
        });
      } else {
        await loginUser({
          email: form.email,
          password: form.password
        });
      }

      router.push("/feed");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao processar autenticação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-of-border bg-of-surface/90 p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="font-[var(--font-heading)] text-5xl leading-none tracking-wide text-of-text">OnlyFrangos</p>
          <p className="mt-2 text-sm text-of-muted">{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" ? (
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-of-text">
                Nome de usuário
              </label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                className="w-full rounded-xl border border-of-border bg-black/20 px-3 py-2 text-sm outline-none ring-0 transition focus:border-of-primary"
                placeholder="seu_usuario"
                required
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-of-text">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-xl border border-of-border bg-black/20 px-3 py-2 text-sm outline-none ring-0 transition focus:border-of-primary"
              placeholder="voce@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-of-text">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-xl border border-of-border bg-black/20 px-3 py-2 text-sm outline-none ring-0 transition focus:border-of-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-of-primary px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-of-primaryHover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-of-muted">
          {mode === "login" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <a href={mode === "login" ? "/register" : "/login"} className="font-semibold text-of-primary hover:text-of-primaryHover">
            {mode === "login" ? "Crie uma" : "Entre agora"}
          </a>
        </p>
      </div>
    </div>
  );
}
