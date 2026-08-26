import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppVariant = 'development' | 'preview' | 'production';

const variantConfiguration: Record<
  AppVariant,
  { displayName: string; identifierSuffix: string; scheme: string }
> = {
  development: {
    displayName: 'OnlyFrangos Dev',
    identifierSuffix: '.dev',
    scheme: 'onlyfrangos-dev',
  },
  preview: {
    displayName: 'OnlyFrangos Preview',
    identifierSuffix: '.preview',
    scheme: 'onlyfrangos-preview',
  },
  production: {
    displayName: 'OnlyFrangos',
    identifierSuffix: '',
    scheme: 'onlyfrangos',
  },
};

function resolveAppVariant(): AppVariant {
  const configuredVariant = process.env.APP_VARIANT ?? 'development';

  if (
    configuredVariant === 'development' ||
    configuredVariant === 'preview' ||
    configuredVariant === 'production'
  ) {
    return configuredVariant;
  }

  throw new Error(`APP_VARIANT inválido: ${configuredVariant}`);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const appVariant = resolveAppVariant();
  const variant = variantConfiguration[appVariant];
  const bundleIdentifier = `com.onlyfrangos.app${variant.identifierSuffix}`;

  return {
    ...config,
    name: variant.displayName,
    slug: 'onlyfrangos',
    version: '0.1.0',
    orientation: 'portrait',
    icon: '../web/public/branding/onlyfrangos-logo.png',
    scheme: variant.scheme,
    userInterfaceStyle: 'dark',
    ios: {
      bundleIdentifier,
      supportsTablet: true,
      associatedDomains: ['applinks:onlyfrangos.com'],
    },
    android: {
      package: bundleIdentifier,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'onlyfrangos.com',
              pathPrefix: '/',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      adaptiveIcon: {
        foregroundImage: '../web/public/branding/onlyfrangos-logo.png',
        backgroundColor: '#0B0B0F',
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: '../web/public/branding/onlyfrangos-logo.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#0B0B0F',
          dark: {
            image: '../web/public/branding/onlyfrangos-logo.png',
            backgroundColor: '#0B0B0F',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appVariant,
    },
  };
};
