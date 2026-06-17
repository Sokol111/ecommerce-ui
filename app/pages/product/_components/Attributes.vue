<script setup lang="ts">
import { AttributeRole, AttributeType, type AttributeValue } from '@sokol111/ecommerce-product-query-service-api';

interface Props {
  attributes: AttributeValue[]
}

const props = defineProps<Props>()

const variantAttributes = computed(() =>
  props.attributes.filter(attr => attr.role === AttributeRole.VARIANT)
)

const specAttributes = computed(() =>
  props.attributes.filter(attr => attr.role === AttributeRole.SPECIFICATION)
)

const renderValue = (attribute: AttributeValue): string => {
  const { type, unit, values } = attribute
  if (values.length === 0) return '-'

  switch (type) {
    case AttributeType.SINGLE:
      return values[0]?.value || '-'
    case AttributeType.MULTIPLE:
      return values.map(v => v.value).join(', ') || '-'
    case AttributeType.RANGE:
      return values[0]?.value ? `${values[0].value}${unit ? ` ${unit}` : ''}` : '-'
    case AttributeType.BOOLEAN:
      return values[0]?.value === 'true' ? 'Yes' : 'No'
    case AttributeType.TEXT:
      return values[0]?.value || '-'
    default:
      return '-'
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Variant Attributes (for selection like color, size) -->
    <div
      v-if="variantAttributes.length > 0"
      class="flex flex-col gap-4"
    >
      <div
        v-for="attr in variantAttributes"
        :key="attr.attributeId"
        class="flex flex-col gap-2"
      >
        <span class="text-sm font-medium">{{ attr.name }}</span>
        <div class="flex flex-wrap gap-2">
          <template v-if="attr.type === AttributeType.SINGLE || attr.type === AttributeType.MULTIPLE">
            <UBadge
              v-for="(val, idx) in attr.values"
              :key="val.slug ?? idx"
              variant="outline"
              class="px-3 py-1.5"
              :style="val.colorCode ? { borderColor: val.colorCode } : undefined"
            >
              <span
                v-if="val.colorCode"
                class="w-4 h-4 rounded-full mr-2 border"
                :style="{ backgroundColor: val.colorCode }"
              />
              {{ val.value }}
            </UBadge>
          </template>
        </div>
      </div>
    </div>

    <!-- Specification Attributes (for display) -->
    <UCard v-if="specAttributes.length > 0">
      <template #header>
        <h3 class="text-lg font-semibold">
          Specifications
        </h3>
      </template>
      <div class="flex flex-col divide-y">
        <div
          v-for="attr in specAttributes"
          :key="attr.attributeId"
          class="flex justify-between items-center py-3 first:pt-0 last:pb-0"
        >
          <span class="text-(--ui-text-muted)">{{ attr.name }}</span>
          <span class="font-medium text-right">{{ renderValue(attr) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
