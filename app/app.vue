<script setup lang="ts">
const { getAllActiveCategories } = useCategoryApi()

const { data: categories } = await useAsyncData('categories', () => getAllActiveCategories())

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'uk'
  }
})

const title = 'Ecommerce Store'
const description = 'Ласкаво просимо до нашого інтернет-магазину'

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
        <NuxtLink to="/" class="text-lg font-semibold whitespace-nowrap">
          Ecommerce Store
        </NuxtLink>

        <nav class="hidden md:flex ml-8">
          <ul class="flex gap-4 text-sm font-medium">
            <li v-for="category in categories" :key="category.id">
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

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain class="p-5">
      <div class="mx-auto w-full max-w-7xl px-4 md:px-8">
        <NuxtPage />
      </div>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          &copy; {{ new Date().getFullYear() }} Ecommerce UI. All rights reserved.
        </p>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UFooter>
  </UApp>
</template>
