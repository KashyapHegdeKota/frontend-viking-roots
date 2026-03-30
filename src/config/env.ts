export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Gimli Saga',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const
