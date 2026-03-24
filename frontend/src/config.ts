const defaultDevApiUrl = 'http://localhost:9000/api'

export const baseURLApi = process.env.NEXT_PUBLIC_BACK_API
  || (process.env.NODE_ENV === 'development' ? defaultDevApiUrl : '/api')
export const swaggerDocsURL = (process.env.NEXT_PUBLIC_BACK_API || baseURLApi).replace(/\/api\/?$/, '/api-docs/')

export const localStorageDarkModeKey = 'darkMode'

export const localStorageStyleKey = 'style'

export const containerMaxW = 'xl:max-w-full xl:mx-auto 2xl:mx-20'

export const appTitle = 'Appeal Control'

export const getPageTitle = (currentPageTitle: string) => `${currentPageTitle} — ${appTitle}`

export const tinyKey = process.env.NEXT_PUBLIC_TINY_KEY || ''
