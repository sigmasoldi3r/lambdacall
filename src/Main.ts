import 'reflect-metadata'
import entry from 'ts-entry-point'
import * as PEG from 'peggy'
import Container from 'typedi'
import App from './service/App'

@entry
export default class Main {
  static main() {
    return Container.get(App).run()
  }
}
