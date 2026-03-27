// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: import.meta.dev
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    productQueryApiUrl: '',
    categoryQueryApiUrl: ''
  },

  routeRules: {
    // Disable prerendering for dynamic content
  },

  experimental: {
    typedPages: true
  },

  compatibilityDate: '2025-01-15',

  vite: {
    server: {
      allowedHosts: true
    }
  },

  hooks: {
    'pages:extend': function (pages) {
      // Remove routes generated from _components directories
      interface NuxtPage { path: string, name?: string, children?: NuxtPage[] }
      function removePagesWithComponents(pages: NuxtPage[]) {
        for (let i = pages.length - 1; i >= 0; i--) {
          const page = pages[i]!
          if (page.path.includes('_components') || page.name?.includes('_components')) {
            pages.splice(i, 1)
          } else if (page.children) {
            removePagesWithComponents(page.children)
          }
        }
      }
      removePagesWithComponents(pages as NuxtPage[])
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    provider: 'none'
  }
})
