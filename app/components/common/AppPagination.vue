<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const router = useRouter()
const route = useRoute()

const handlePageChange = (page: number) => {
  router.push({ query: { ...route.query, page: page.toString() } })
}
</script>

<template>
  <UPagination
    :default-page="currentPage"
    :total="totalPages"
    :items-per-page="1"
    @update:page="handlePageChange"
  />
</template>
