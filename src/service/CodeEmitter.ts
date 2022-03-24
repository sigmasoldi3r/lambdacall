import AbstractService from '../lib/AbstractService'
import { Script } from './Parser'

/**
 * Independently from the implmentation, emits code based
 * on the input abstract syntax tree and the source file.
 *
 * The actual output is decided by implementation.
 */
export interface CodeEmitter {
  emit(script: Script, source: string): Promise<void>
}

export default AbstractService<CodeEmitter>()
