const path = require('path');

const watchFolders = [
  path.resolve(__dirname, '..', '..', 'node_modules'),
  path.resolve(__dirname, '..', 'common-modules'),
];
const blockList = [/\/__tests__\/.*/, /\/packages\/web\/.*/];

module.exports = {
  transformer: {
    publicPath: '/assets/dark/magic',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['react-native', 'browser', 'module', 'main'],
    blockList,
  },
  watchFolders,
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.startsWith('/assets/dark/magic')) {
          req.url = req.url.replace('/assets/dark/magic', '/assets');
        } else if (req.url.startsWith('/assets/dark')) {
          req.url = req.url.replace('/assets/dark', '/assets/..');
        } else if (req.url.startsWith('/assets')) {
          req.url = req.url.replace('/assets', '/assets/../..');
        }
        return middleware(req, res, next);
      };
    },
  },
};
