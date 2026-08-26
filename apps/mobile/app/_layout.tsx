import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppProviders } from '../src/providers/app-providers';
import { mobileTheme } from '../src/theme/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [areFontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (areFontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [areFontsLoaded, fontError]);

  if (fontError) {
    throw fontError;
  }

  if (!areFontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: mobileTheme.colors.background },
          headerStyle: { backgroundColor: mobileTheme.colors.surface },
          headerTintColor: mobileTheme.colors.text,
          headerTitleStyle: { fontFamily: mobileTheme.typography.bodyBoldFontFamily },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="compose"
          options={{ animation: 'slide_from_bottom', headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="menu"
          options={{ animation: 'slide_from_bottom', headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen name="post/[id]" options={{ title: 'Publicação' }} />
        <Stack.Screen name="profile/[username]" options={{ title: 'Perfil' }} />
        <Stack.Screen name="gym/[id]" options={{ title: 'Academia' }} />
      </Stack>
    </AppProviders>
  );
}
