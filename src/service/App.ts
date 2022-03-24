import { readFileSync } from 'fs'
import { Service } from 'typedi'
import CodeEmitter from './CodeEmitter'
import Parser from './Parser'
import './impl'

@Service()
export default class App {
  readonly parser = Parser.require()
  readonly emitter = CodeEmitter.require()

  async doFile(file: string) {
    console.log('Compiling', file)
    return await this.emitter.emit(
      await this.parser.parse(readFileSync(file)),
      file
    )
  }

  async run() {
    const files = [
      'examples/test.lam',
      'examples/example-lib.lam',
      'examples/example-permissive.lam',
    ]
    for (const file of files) {
      try {
        await this.doFile(file)
      } catch (err) {
        console.error(`Can't compile ${file}!\n `, err)
      }
    }
  }
}
