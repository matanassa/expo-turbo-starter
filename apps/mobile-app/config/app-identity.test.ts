import { resolveAppIdentity } from '../app.config';

describe('resolveAppIdentity', () => {
  it('refuses to resolve a production build with placeholder native identifiers', () => {
    expect(() =>
      resolveAppIdentity({
        ANDROID_PACKAGE: 'com.acme.mobile',
        EAS_BUILD_PROFILE: 'production',
        EAS_PROJECT_ID: '00000000-0000-0000-0000-000000000000',
        IOS_BUNDLE_IDENTIFIER: 'com.example.mobile',
      })
    ).toThrow('Production builds require a non-placeholder IOS_BUNDLE_IDENTIFIER');
  });

  it('checks the Android identifier independently for production builds', () => {
    expect(() =>
      resolveAppIdentity({
        ANDROID_PACKAGE: 'com.example.mobile',
        EAS_BUILD_PROFILE: 'production',
        EAS_PROJECT_ID: '00000000-0000-0000-0000-000000000000',
        IOS_BUNDLE_IDENTIFIER: 'com.acme.mobile',
      })
    ).toThrow('Production builds require a non-placeholder ANDROID_PACKAGE');
  });

  it('requires an EAS project before resolving production configuration', () => {
    expect(() =>
      resolveAppIdentity({
        ANDROID_PACKAGE: 'com.acme.mobile',
        APP_ENV: 'production',
        IOS_BUNDLE_IDENTIFIER: 'com.acme.mobile',
      })
    ).toThrow('Production builds require EAS_PROJECT_ID');
  });

  it('resolves a fully configured production identity', () => {
    expect(
      resolveAppIdentity({
        ANDROID_PACKAGE: 'com.acme.mobile',
        APP_NAME: 'Acme Mobile',
        APP_SCHEME: 'acme-mobile',
        APP_SLUG: 'acme-mobile',
        EAS_BUILD_PROFILE: 'production',
        EAS_PROJECT_ID: '00000000-0000-0000-0000-000000000000',
        IOS_BUNDLE_IDENTIFIER: 'com.acme.mobile',
      })
    ).toEqual({
      androidPackage: 'com.acme.mobile',
      appName: 'Acme Mobile',
      appScheme: 'acme-mobile',
      appSlug: 'acme-mobile',
      easProjectId: '00000000-0000-0000-0000-000000000000',
      iosBundleIdentifier: 'com.acme.mobile',
    });
  });
});
