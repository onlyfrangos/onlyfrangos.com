import type { AuthPolicies } from '@onlyfrangos/types';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { BrandWordmark } from '../../../components/branding/brand-wordmark';
import { AppScreen } from '../../../components/layout/app-screen';
import { AppButton } from '../../../components/ui/app-button';
import { AppText } from '../../../components/ui/app-text';
import { AppTextField } from '../../../components/ui/app-text-field';
import { useAuth } from '../../../providers/auth-provider';
import { useTheme } from '../../../theme/theme-provider';

type AuthPreviewScreenProps = {
  mode: 'login' | 'register';
};

type AuthFormState = {
  age: string;
  cityId: string;
  email: string;
  fullName: string;
  password: string;
  username: string;
};

const initialForm: AuthFormState = {
  age: '',
  cityId: '',
  email: '',
  fullName: '',
  password: '',
  username: '',
};

export function AuthPreviewScreen({ mode }: AuthPreviewScreenProps) {
  const isLogin = mode === 'login';
  const { login, register, sdk } = useAuth();
  const theme = useTheme();
  const [form, setForm] = useState(initialForm);
  const [policies, setPolicies] = useState<AuthPolicies | null>(null);
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLogin) {
      return;
    }

    let isActive = true;
    void sdk
      .getPolicies()
      .then((currentPolicies) => {
        if (isActive) {
          setPolicies(currentPolicies);
        }
      })
      .catch((policyError: unknown) => {
        if (isActive) {
          setErrorMessage(getErrorMessage(policyError, 'Não foi possível carregar os termos.'));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isLogin, sdk]);

  const updateField = (field: keyof AuthFormState, input: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: input }));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const email = form.email.trim().toLowerCase();

    if (!email || form.password.length < 6) {
      setErrorMessage('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login({ email, password: form.password });
        return;
      }

      const age = Number(form.age);
      const cityId = Number(form.cityId);
      if (
        !form.fullName.trim() ||
        !form.username.trim() ||
        !Number.isInteger(age) ||
        age < 18 ||
        !Number.isInteger(cityId) ||
        cityId < 1
      ) {
        setErrorMessage('Preencha todos os campos. É necessário ter pelo menos 18 anos.');
        return;
      }
      if (!policies || !hasAcceptedPolicies) {
        setErrorMessage('Leia e aceite os termos, a privacidade e as diretrizes da comunidade.');
        return;
      }

      await register(
        {
          age,
          cityId,
          email,
          fullName: form.fullName.trim(),
          password: form.password,
          username: form.username.trim().toLowerCase(),
        },
        {
          communityGuidelinesVersion: policies.communityGuidelinesVersion,
          privacyPolicyVersion: policies.privacyPolicyVersion,
          termsVersion: policies.termsVersion,
        },
      );
    } catch (submitError) {
      setErrorMessage(getErrorMessage(submitError, 'Não foi possível concluir a autenticação.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen isScrollable testID={`${mode}-screen`}>
      <View style={styles.brand}>
        <BrandWordmark />
        <AppText style={styles.centered} tone="muted">
          Treine. Compartilhe. Evolua.
        </AppText>
      </View>
      <View style={styles.form}>
        {!isLogin ? (
          <>
            <AppTextField
              label="Nome completo"
              onChangeText={(input) => updateField('fullName', input)}
              placeholder="Seu nome"
              value={form.fullName}
            />
            <AppTextField
              autoCapitalize="none"
              label="Nome de usuário"
              onChangeText={(input) => updateField('username', input)}
              placeholder="seu_usuario"
              value={form.username}
            />
          </>
        ) : null}
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-mail"
          onChangeText={(input) => updateField('email', input)}
          placeholder="voce@exemplo.com"
          value={form.email}
        />
        <AppTextField
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          label="Senha"
          onChangeText={(input) => updateField('password', input)}
          placeholder="Sua senha"
          secureTextEntry
          value={form.password}
        />
        {!isLogin ? (
          <>
            <AppTextField
              keyboardType="number-pad"
              label="Idade"
              onChangeText={(input) => updateField('age', input)}
              placeholder="18"
              value={form.age}
            />
            <AppTextField
              keyboardType="number-pad"
              label="Código IBGE da cidade"
              onChangeText={(input) => updateField('cityId', input)}
              placeholder="Ex.: 2304400"
              value={form.cityId}
            />
            <View style={[styles.policyRow, { borderColor: theme.colors.border }]}>
              <AppText style={styles.policyText} variant="caption">
                Li e aceito os Termos, a Política de Privacidade e as Diretrizes da Comunidade.
              </AppText>
              <Switch
                accessibilityLabel="Aceitar documentos legais"
                onValueChange={setHasAcceptedPolicies}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                value={hasAcceptedPolicies}
              />
            </View>
          </>
        ) : null}
        {errorMessage ? (
          <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
            {errorMessage}
          </AppText>
        ) : null}
        <AppButton
          isLoading={isSubmitting}
          label={isLogin ? 'Entrar' : 'Criar conta'}
          onPress={() => void handleSubmit()}
        />
      </View>
      <Link href={isLogin ? '/register' : '/login'} style={styles.link}>
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
      </Link>
    </AppScreen>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: 5,
    paddingBottom: 34,
    paddingTop: 60,
  },
  centered: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  link: {
    color: '#FCFAF4',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    padding: 22,
    textAlign: 'center',
  },
  policyRow: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    padding: 12,
  },
  policyText: {
    flex: 1,
  },
});
