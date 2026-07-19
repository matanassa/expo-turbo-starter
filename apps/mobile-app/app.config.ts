import type { ExpoConfig } from 'expo/config';

const appName = process.env.APP_NAME ?? 'Expo Monorepo Starter';
const appSlug = process.env.APP_SLUG ?? 'expo-monorepo-starter';
const appScheme = process.env.APP_SCHEME ?? 'expo-monorepo-starter';
const iosBundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER ?? 'com.example.expomonorepostarter';
const androidPackage = process.env.ANDROID_PACKAGE ?? 'com.example.expomonorepostarter';
const easProjectId = process.env.EAS_PROJECT_ID;

const config: ExpoConfig = {
  name: appName,
  slug: appSlug,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: appScheme,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: iosBundleIdentifier,
    icon: './assets/expo.icon',
    supportsTablet: true,
  },
  android: {
    package: androidPackage,
    adaptiveIcon: {
      backgroundColor: '#EEF1F6',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F6F7FB',
        image: './assets/images/splash-icon.png',
        imageWidth: 96,
      },
    ],
  ],
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
  extra: easProjectId
    ? {
        eas: {
          projectId: easProjectId,
        },
      }
    : undefined,
};

export default config;
