/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistylesOptions = {
  root: 'src',
  autoProcessImports: ['@starter/ui'],
  autoProcessPaths: ['@starter/ui'],
};

module.exports = function babelConfig(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [['react-native-unistyles/plugin', unistylesOptions]],
  };
};
