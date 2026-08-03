# AGENTS.md

## Stack and Commands

This is the Nuxt 4 / TypeScript storefront, managed with pnpm.

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm link:local          # use sibling product-query and category-query API packages
pnpm unlink:local        # restore packaged API dependencies
```

There is no test script yet. Do not edit `.nuxt/` or `.output/`. Keep real values in ignored
`.env`; only non-secret defaults belong in `.env.example`.

## Structure and Boundaries

- `app/` contains storefront pages, components, composables, and client UI.
- `server/api/` is the Nitro BFF boundary; browser code calls local `/api` routes.
- `server/utils/product-query-client.ts` and `category-query-client.ts` own server-side Connect
  clients. Preserve tenant-header propagation and do not construct transports in route handlers.
- This is a query-side storefront: use product-query and category-query APIs, not catalog write APIs.

## API Contracts

Generated clients are owned by `ecommerce-product-query-service-api` and
`ecommerce-category-query-service-api`. Never edit their `gen/typescript` output: change the
owning `.proto` and run that API repo's `make generate`. Use `pnpm link:local` only for
cross-repository API development.
