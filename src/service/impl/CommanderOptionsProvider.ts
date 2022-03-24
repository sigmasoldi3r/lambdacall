import { program } from 'commander'
import Service, { OptionsProvider } from '../OptionsProvider'

@Service.provide()
export default class CommanderOptionsProvider implements OptionsProvider {
  options: { permissive: boolean; target?: string }
  constructor() {
    const { permissive, target } = program
      .option(
        '--permissive',
        'Enables relaxed syntax for cases where special symbols are needed.'
      )
      .option(
        '-t, --target',
        'Specifies the language target, which by default is C++.',
        'cpp'
      )
      .parse(process.argv)
      .opts()
    this.options = {
      permissive: Boolean(permissive),
      target,
    }
  }
}
