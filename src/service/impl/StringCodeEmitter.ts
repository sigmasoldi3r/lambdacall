import Service, { CodeEmitter } from '../CodeEmitter'
import CodeGenerator from '../CodeGenerator'
import { Script } from '../Parser'

/**
 * This code emitter will store it's output into an internal buffer called
 * output.
 */
@Service.provide()
export default class StringCodeEmitter implements CodeEmitter {
  constructor(readonly generator = CodeGenerator.require()) {}

  output: string = ''
  async emit(script: Script, source: string) {
    this.output = ''
    for await (const result of this.generator.generate(script, source)) {
      this.output += result.output
      console.log(`Built ${result.target}`)
    }
  }

  /**
   * In-place code emision, for specific implementations and such.
   */
  async build(code: Script, source: string = '<unknown source>') {
    await this.emit(code, source)
    return this.output
  }
}
