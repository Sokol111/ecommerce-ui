<script setup lang="ts">
interface Props {
  label?: string
  unit?: string
  min?: number
  max?: number
  rangeMin?: number
  rangeMax?: number
  /** Discrete values to snap to (sorted). When provided, slider steps through these values only. */
  steps?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  apply: [min?: number, max?: number]
}>()

// --- Discrete mode (steps provided) ---
const hasSteps = computed(() => !!props.steps && props.steps.length >= 2)

const valueToIndex = (val: number) => {
  if (!props.steps) return 0
  // Find closest step index
  let closest = 0
  let minDiff = Math.abs(props.steps[0]! - val)
  for (let i = 1; i < props.steps.length; i++) {
    const diff = Math.abs(props.steps[i]! - val)
    if (diff < minDiff) {
      minDiff = diff
      closest = i
    }
  }
  return closest
}

const indexToValue = (idx: number) => props.steps?.[idx] ?? 0

// --- Continuous mode (no steps) ---
const effectiveMin = computed(() => props.rangeMin ?? 0)
const effectiveMax = computed(() => props.rangeMax ?? 100)

const hasRange = computed(() => {
  if (hasSteps.value) return true
  return effectiveMin.value < effectiveMax.value
})

// Slider model: indices for discrete mode, actual values for continuous
const sliderValue = ref(
  hasSteps.value
    ? [valueToIndex(props.min ?? props.steps![0]!), valueToIndex(props.max ?? props.steps![props.steps!.length - 1]!)]
    : [props.min ?? effectiveMin.value, props.max ?? effectiveMax.value]
)

watch([() => props.min, () => props.max, effectiveMin, effectiveMax, () => props.steps], () => {
  if (hasSteps.value) {
    sliderValue.value = [
      valueToIndex(props.min ?? props.steps![0]!),
      valueToIndex(props.max ?? props.steps![props.steps!.length - 1]!)
    ]
  } else {
    sliderValue.value = [
      props.min ?? effectiveMin.value,
      props.max ?? effectiveMax.value
    ]
  }
})

const sliderMin = computed(() => hasSteps.value ? 0 : effectiveMin.value)
const sliderMax = computed(() => hasSteps.value ? props.steps!.length - 1 : effectiveMax.value)

// Display values (always real values)
const displayMin = computed(() => {
  if (hasSteps.value) return indexToValue(sliderValue.value[0] ?? 0)
  return sliderValue.value[0] ?? effectiveMin.value
})

const displayMax = computed(() => {
  if (hasSteps.value) return indexToValue(sliderValue.value[1] ?? 0)
  return sliderValue.value[1] ?? effectiveMax.value
})

const rangeDisplayMin = computed(() => hasSteps.value ? props.steps![0]! : effectiveMin.value)
const rangeDisplayMax = computed(() => hasSteps.value ? props.steps![props.steps!.length - 1]! : effectiveMax.value)

const handleChange = () => {
  let minVal: number
  let maxVal: number
  if (hasSteps.value) {
    minVal = indexToValue(sliderValue.value[0] ?? 0)
    maxVal = indexToValue(sliderValue.value[1] ?? 0)
  } else {
    minVal = sliderValue.value[0] ?? effectiveMin.value
    maxVal = sliderValue.value[1] ?? effectiveMax.value
  }
  const emitMin = minVal <= rangeDisplayMin.value ? undefined : minVal
  const emitMax = maxVal >= rangeDisplayMax.value ? undefined : maxVal
  emit('apply', emitMin, emitMax)
}

const formatValue = (val: number) => {
  if (props.unit) return `${val} ${props.unit}`
  return val.toString()
}
</script>

<template>
  <div v-if="hasRange" class="space-y-3">
    <UFormField v-if="label" :label="label" />
    <div class="flex items-center justify-between text-sm font-medium">
      <span>{{ formatValue(displayMin) }}</span>
      <span>{{ formatValue(displayMax) }}</span>
    </div>
    <USlider
      v-model="sliderValue"
      :min="sliderMin"
      :max="sliderMax"
      tooltip
      @change="handleChange"
    />
    <div class="flex items-center justify-between text-xs text-dimmed">
      <span>{{ formatValue(rangeDisplayMin) }}</span>
      <span>{{ formatValue(rangeDisplayMax) }}</span>
    </div>
  </div>
</template>
