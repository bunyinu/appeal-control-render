export function installProductionConsoleGuards() {
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_ENABLE_BROWSER_DEBUG_LOGS === 'true'
  ) {
    return
  }

  const noop = () => undefined

  console.log = noop
  console.info = noop
  console.debug = noop
}
