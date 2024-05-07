import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addComponentsDir  } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  gtag_id: string | null,
  hotjar_id: string | null,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'hes',
    configKey: 'hes',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    gtag_id: null,
    hotjar_id: null
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.hes = defu(nuxt.options.runtimeConfig.public.hes as any, {...options})

    addPlugin({
      src: resolver.resolve('./runtime/plugins/plugin'),
      mode: "client", 
    })
    addImportsDir(resolver.resolve('runtime/composables'))

    addComponentsDir({
      path: resolver.resolve('runtime/components')
    })
  },
})
