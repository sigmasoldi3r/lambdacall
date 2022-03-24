import Container, { Token, Service } from 'typedi'

export default function AbstractService<T>() {
  const r = {
    token: new Token<T>(),
    provide() {
      return Service(this.token)
    },
    require() {
      return Container.get(this.token) as T
    },
  }
  return r as typeof r & { service: T }
}
