import type { ExpoConfig } from 'expo/config';

export type AppIdentity = {
  androidPackage: string;
  appName: string;
  appScheme: string;
  appSlug: string;
  easProjectId: string | undefined;
  iosBundleIdentifier: string;
};

type Environment = Readonly<Record<string, string | undefined>>;

const defaults: AppIdentity = {
  androidPackage: 'com.example.expoturbostarter',
  appName: 'Expo Turbo Starter',
  appScheme: 'expo-turbo-starter',
  appSlug: 'expo-turbo-starter',
  easProjectId: undefined,
  iosBundleIdentifier: 'com.example.expoturbostarter',
};

export function resolveAppIdentity(environment: Environment): AppIdentity {
  const identity = {
    androidPackage: environment.ANDROID_PACKAGE ?? defaults.androidPackage,
    appName: environment.APP_NAME ?? defaults.appName,
    appScheme: environment.APP_SCHEME ?? defaults.appScheme,
    appSlug: environment.APP_SLUG ?? defaults.appSlug,
    easProjectId: environment.EAS_PROJECT_ID,
    iosBundleIdentifier: environment.IOS_BUNDLE_IDENTIFIER ?? defaults.iosBundleIdentifier,
  };

  const isProductionBuild =
    environment.APP_ENV === 'production' || environment.EAS_BUILD_PROFILE === 'production';

  if (isProductionBuild && identity.iosBundleIdentifier.startsWith('com.example.')) {
    throw new Error('Production builds require a non-placeholder IOS_BUNDLE_IDENTIFIER.');
  }

  if (isProductionBuild && identity.androidPackage.startsWith('com.example.')) {
    throw new Error('Production builds require a non-placeholder ANDROID_PACKAGE.');
  }

  if (isProductionBuild && !identity.easProjectId) {
    throw new Error(
      'Production builds require EAS_PROJECT_ID. Run eas init and configure it first.'
    );
  }

  return identity;
}

const { androidPackage, appName, appScheme, appSlug, easProjectId, iosBundleIdentifier } =
  resolveAppIdentity(process.env);

const config: ExpoConfig = {
  name: appName,
  slug: appSlug,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: appScheme,
  userInterfaceStyle: 'automatic',
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
  runtimeVersion: {
    policy: 'fingerprint',
  },
  updates: easProjectId
    ? {
        url: `https://u.expo.dev/${easProjectId}`,
      }
    : undefined,
  extra: easProjectId
    ? {
        eas: {
          projectId: easProjectId,
        },
      }
    : undefined,
};

export default config;
