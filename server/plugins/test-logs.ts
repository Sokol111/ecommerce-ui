import { consola } from 'consola'

export default defineNitroPlugin(() => {
  for (let i = 1; i <= 50; i++) {
    consola.info(`[test] ecommerce-ui info log #${i} — server running normally`)
    consola.warn(`[test] ecommerce-ui warn log #${i} — cache miss detected`)
    consola.error(`[test] ecommerce-ui error log #${i} — connection timeout`)
  }
})
