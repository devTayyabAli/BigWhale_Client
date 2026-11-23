/**
 * Maintenance mode switch.
 *
 * While ON, every page of the user website shows the maintenance banner
 * (see src/proxy.js and src/pages/maintenance). Nobody can open any other page.
 *
 * Turn it OFF:
 *   - set MAINTENANCE_ENABLED below to false and redeploy, OR
 *   - set the server env var MAINTENANCE_MODE=false and restart the container
 *     (the env var, when set, wins over this constant — no rebuild needed).
 */
export const MAINTENANCE_ENABLED = true

export const MAINTENANCE_PATH = '/maintenance/'

export const isMaintenanceOn = () => {
  const env = process.env.MAINTENANCE_MODE
  if (env === 'true') return true
  if (env === 'false') return false

  return MAINTENANCE_ENABLED
}
