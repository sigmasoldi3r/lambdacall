import AbstractService from '../lib/AbstractService'
import { Script } from './Parser'

export interface Result {
  /**
   * Target file name.
   */
  target: string
  /**
   * Ouput source string (The actual code).
   */
  output: string
}

export interface CodeGenerator {
  generate(script: Script, source: string): AsyncIterable<Result>
}

export default AbstractService<CodeGenerator>()
