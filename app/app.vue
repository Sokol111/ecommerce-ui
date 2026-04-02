<script setup lang="ts">
import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'

const { data: categories, error: categoriesError } = await useFetch<CategoryResponse[]>('/api/categories')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const requestUrl = useRequestURL()
const adminPanelUrl = computed(() => `${requestUrl.protocol}//admin.${requestUrl.host}`)

const title = 'Ecommerce Store'
const description = 'Welcome to our online store'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="text-lg font-semibold whitespace-nowrap"
        >
          Ecommerce Store
        </NuxtLink>

        <nav class="hidden md:flex ml-8">
          <UAlert
            v-if="categoriesError"
            color="error"
            variant="subtle"
            title="Failed to load categories"
            class="text-xs"
          />
          <ul
            v-else
            class="flex gap-4 text-sm font-medium"
          >
            <li
              v-for="category in categories"
              :key="category.id"
            >
              <NuxtLink
                :to="`/category/${category.id}`"
                class="hover:text-primary transition-colors"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </template>

      <template #body>
        <UAlert
          v-if="categoriesError"
          color="error"
          variant="subtle"
          title="Failed to load categories"
        />
        <UNavigationMenu
          v-else
          orientation="vertical"
          :items="categories?.map(c => ({ label: c.name, to: `/category/${c.id}` })) ?? []"
        />
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <div class="bg-primary/10 text-primary text-center text-sm py-2 px-4">
      The frontend uses caching. After changing data in the
      <a
        :href="adminPanelUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="underline underline-offset-2 font-medium"
      >admin panel</a>, please refresh the page to see the updates.
    </div>

    <UMain class="p-5">
      <div class="mx-auto w-full max-w-7xl px-4 md:px-8">
        <NuxtPage />
      </div>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Portfolio project by Ihor Sokolovskyi &mdash;
          <a
            href="https://github.com/Sokol111/ecommerce-infrastructure"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-2 hover:text-primary"
          >GitHub</a>
        </p>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UFooter>
  </UApp>
</template>
