import Parser, { Script, Parser as P } from '../Parser'
import * as peg from 'peggy'
import { readFileSync } from 'fs'
import OptionsProvider from '../OptionsProvider'

@Parser.provide()
export default class HotParser implements P {
  readonly options = OptionsProvider.require()

  readonly parseImpl = peg.generate(
    readFileSync('assets/grammar.peggy').toString()
  ).parse

  async parse(source: string | Buffer) {
    return this.parseImpl(source.toString())
  }
}
