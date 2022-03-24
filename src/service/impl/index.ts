import OptionsProvider from '../OptionsProvider'

/*
    Implementation module.
    Switches between implmentations based on the abstraction switches (ambient).
 */
require('./CommanderOptionsProvider')

const { options } = OptionsProvider.require()

if (process.env.HOT_RELOAD) {
  require('./HotParser')
} else {
  require('./ColdParser')
}

if (options.target === 'js') {
  require('./JsCodeGenerator')
} else if (options.target === 'cpp') {
  require('./HppCodeGenerator')
} else {
  console.error(`Invalid target ${options.target ?? '<no target>'}`)
  process.exit(1)
}
require('./FileSystemCodeEmitter')
