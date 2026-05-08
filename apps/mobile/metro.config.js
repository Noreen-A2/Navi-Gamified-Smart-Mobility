const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable package exports to force Metro to resolve the CommonJS 'main' entry point
// This fixes the "import.meta" issue with Zustand and other libraries on Web.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
