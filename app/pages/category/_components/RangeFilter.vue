<script setup lang="ts">
interface Props {
  label?: string
  unit?: string
  min?: number
  max?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  apply: [min?: number, max?: number]
}>()

const localMin = ref(props.min?.toString() ?? '')
const localMax = ref(props.max?.toString() ?? '')

watch(() => props.min, (val) => {
  localMin.value = val?.toString() ?? ''
})

watch(() => props.max, (val) => {
  localMax.value = val?.toString() ?? ''
})

const handleApply = () => {
  const minVal = localMin.value ? parseFloat(localMin.value) : undefined
  const maxVal = localMax.value ? parseFloat(localMax.value) : undefined
  emit('apply', minVal, maxVal)
}
</script>

<template>
  <div class="space-y-2">
    <UFormField v-if="label" :label="label" />
    <span v-if="unit" class="text-sm text-muted">{{ unit }}</span>
    <div class="flex items-center gap-2">
      <UInput
        v-model="localMin"
        type="number"
        placeholder="Від"
        :min="0"
        size="sm"
        @keydown.enter="handleApply"
      />
      <span class="text-muted">-</span>
      <UInput
        v-model="localMax"
        type="number"
        placeholder="До"
        :min="0"
        size="sm"
        @keydown.enter="handleApply"
      />
    </div>
    <UButton variant="outline" color="neutral" size="sm" block @click="handleApply">
      Застосувати
    </UButton>
  </div>
</template>
