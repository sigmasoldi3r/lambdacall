import { writeFileSync } from 'fs'
import path = require('path')
import Service, { CodeEmitter } from '../CodeEmitter'
import CodeGenerator from '../CodeGenerator'
import { Script } from '../Parser'

@Service.provide()
export default class FileSystemCodeEmitter implements CodeEmitter {
  readonly generator = CodeGenerator.require()

  root = '.'

  async emit(script: Script, source: string) {
    for await (const result of this.generator.generate(script, source)) {
      const out = path.resolve(this.root, result.target)
      writeFileSync(out, result.output)
    }
  }
}
