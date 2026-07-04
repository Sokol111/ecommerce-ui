import { createClient, type Client } from '@connectrpc/connect'
import { CategoryQueryService, GetCategoryByIdResponseSchema, type GetCategoryByIdResponse } from '@sokol111/ecommerce-category-query-service-api'
import type { UnaryFn } from '@connectrpc/connect'
import type { MessageShape } from '@bufbuild/protobuf'

// Test 1: Check MessageShape
type TestResponseShape = MessageShape<typeof GetCategoryByIdResponseSchema>

// Test 2: Check Client type
type TestClient = Client<typeof CategoryQueryService>

const testClient: TestClient = {} as TestClient;

// Test 3: Try to use the method
async function test() {
  // @ts-ignore
  if (testClient.getCategoryById) {
    const response = await testClient.getCategoryById({id: 'test'});
    const category = response.category;
  }
}
