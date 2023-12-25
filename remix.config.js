const { flatRoutes } = require('remix-flat-routes')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*'],
  appDirectory: 'src',
  serverModuleFormat: 'cjs',
  tailwind: true,
  postcss: true,
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes, { appDir: 'src' })
  }
}
