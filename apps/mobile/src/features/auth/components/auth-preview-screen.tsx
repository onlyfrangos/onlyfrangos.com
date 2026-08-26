import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '../../../components/layout/app-screen';
import { BrandWordmark } from '../../../components/branding/brand-wordmark';
import { AppButton } from '../../../components/ui/app-button';
import { AppText } from '../../../components/ui/app-text';
import { AppTextField } from '../../../components/ui/app-text-field';

type AuthPreviewScreenProps = {
  mode: 'login' | 'register';
};

export function AuthPreviewScreen({ mode }: AuthPreviewScreenProps) {
  const isLogin = mode === 'login';

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
            <AppTextField label="Nome completo" placeholder="Seu nome" />
            <AppTextField autoCapitalize="none" label="Nome de usuário" placeholder="seu_usuario" />
          </>
        ) : null}
        <AppTextField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="E-mail"
          placeholder="voce@exemplo.com"
        />
        <AppTextField
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          label="Senha"
          placeholder="Sua senha"
          secureTextEntry
        />
        <AppButton label={isLogin ? 'Entrar' : 'Criar conta'} />
      </View>
      <Link href={isLogin ? '/register' : '/login'} style={styles.link}>
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
      </Link>
    </AppScreen>
  );
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
});
