'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { checkUsernameAvailability, loginUser, registerUser } from '../../../lib/auth';
import { LocationSelects } from '../../locations/location-selects';

type AuthFormProps = { mode: 'login' | 'register' };
type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/feed';
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    age: '',
    stateId: '',
    cityId: '',
    password: '',
  });
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'register' || form.username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    let active = true;
    setUsernameStatus('checking');
    const timer = window.setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability(form.username);
        if (active) setUsernameStatus(result.available ? 'available' : 'unavailable');
      } catch {
        if (active) setUsernameStatus('error');
      }
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [form.username, mode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        if (usernameStatus !== 'available')
          throw new Error('Escolha um nome de usuário disponível');
        await registerUser({
          fullName: form.fullName.trim(),
          username: form.username,
          email: form.email,
          age: Number(form.age),
          cityId: Number(form.cityId),
          password: form.password,
        });
      } else {
        await loginUser({ email: form.email, password: form.password });
      }

      router.push(decodeURIComponent(redirectTo));
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Erro ao processar autenticação',
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    'w-full rounded-xl border border-of-border bg-black/20 px-3 py-2.5 text-sm text-of-text outline-none transition placeholder:text-of-muted/70 focus:border-of-primary focus:ring-2 focus:ring-of-primary/20';
  const usernameHint = {
    idle: form.username
      ? 'Use ao menos 3 caracteres.'
      : 'Letras minúsculas, números, ponto ou underline.',
    checking: 'Verificando disponibilidade...',
    available: 'Nome de usuário disponível!',
    unavailable: 'Esse nome de usuário já está em uso.',
    error: 'Não foi possível verificar agora. Tente novamente.',
  }[usernameStatus];

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <section
        className={`w-full rounded-2xl border border-of-border bg-of-surface/90 p-5 shadow-2xl backdrop-blur sm:p-8 ${mode === 'register' ? 'max-w-xl' : 'max-w-md'}`}
      >
        <header className="mb-6 text-center">
          <Image
            src="/branding/onlyfrangos-logo.png"
            alt="Only Frangos"
            width={160}
            height={160}
            priority
            className="mx-auto h-24 w-24 object-contain sm:h-28 sm:w-28"
          />
          <h1 className="mt-2 font-[var(--font-heading)] text-3xl tracking-wide text-of-text sm:text-4xl">
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </h1>
          <p className="mt-1 text-sm text-of-muted">
            {mode === 'login'
              ? 'Acesse seu feed e continue sua evolução.'
              : 'Preencha seus dados para entrar na comunidade.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" htmlFor="fullName" className="sm:col-span-2">
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  className={inputClassName}
                  placeholder="Seu nome completo"
                  minLength={2}
                  maxLength={30}
                  required
                />
                <p className="mt-1 text-right text-xs text-of-muted">{form.fullName.length}/30</p>
              </Field>
              <Field label="Nome de usuário" htmlFor="username">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      username: event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''),
                    }))
                  }
                  className={inputClassName}
                  placeholder="seu_usuario"
                  minLength={3}
                  maxLength={30}
                  pattern="[a-z0-9._]+"
                  aria-describedby="username-status"
                  required
                />
                <p
                  id="username-status"
                  className={`mt-1.5 text-xs ${usernameStatus === 'available' ? 'text-green-400' : usernameStatus === 'unavailable' || usernameStatus === 'error' ? 'text-red-400' : 'text-of-muted'}`}
                  aria-live="polite"
                >
                  {usernameHint} <span className="float-right">{form.username.length}/30</span>
                </p>
              </Field>
              <Field label="Idade" htmlFor="age">
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, age: event.target.value }))
                  }
                  className={inputClassName}
                  placeholder="18"
                  min={18}
                  max={120}
                  required
                />
              </Field>
              <LocationSelects
                stateId={form.stateId}
                cityId={form.cityId}
                onStateChange={(stateId) =>
                  setForm((current) => ({ ...current, stateId, cityId: '' }))
                }
                onCityChange={(cityId) => setForm((current) => ({ ...current, cityId }))}
                className={inputClassName}
              />
            </div>
          ) : null}

          <Field label="E-mail" htmlFor="email">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className={inputClassName}
              placeholder="voce@email.com"
              required
            />
          </Field>
          <Field label="Senha" htmlFor="password">
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className={inputClassName}
              placeholder="Mínimo de 6 caracteres"
              minLength={6}
              required
            />
          </Field>

          {error ? (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={
              loading ||
              (mode === 'register' &&
                (usernameStatus === 'checking' || usernameStatus === 'unavailable'))
            }
            className="w-full rounded-xl bg-of-primary px-4 py-3 text-sm font-semibold text-black transition hover:bg-of-primaryHover focus:outline-none focus:ring-2 focus:ring-of-primary focus:ring-offset-2 focus:ring-offset-of-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-of-muted">
          {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
          <Link
            href={mode === 'login' ? '/register' : '/login'}
            className="font-semibold text-of-primary hover:text-of-primaryHover"
          >
            {mode === 'login' ? 'Cadastre-se' : 'Entre agora'}
          </Link>
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-of-text">
        {label}
      </label>
      {children}
    </div>
  );
}
