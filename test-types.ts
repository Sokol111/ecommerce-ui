import type { MessageShape } from '@bufbuild/protobuf'
import type { Client } from '@connectrpc/connect'
import type { CategoryQueryService, GetCategoryByIdResponseSchema } from '@sokol111/ecommerce-category-query-service-api'

// Test 1: Check MessageShape
export type TestResponseShape = MessageShape<typeof GetCategoryByIdResponseSchema>

// Test 2: Check Client type
export type TestClient = Client<typeof CategoryQueryService>

const testClient: TestClient = {} as TestClient

// Test 3: Try to use the method
export async function _test() {
  // @ts-expect-error testing method access
  if (testClient.getCategoryById) {
    const response = await testClient.getCategoryById({ id: 'test' })
    const _category = response.category
  }
}
