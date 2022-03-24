import AbstractService from '../lib/AbstractService'

/**
 * Provides command options.
 */
export interface OptionsProvider {
  options: {
    permissive: boolean
    target?: string
  }
}

export default AbstractService<OptionsProvider>()
