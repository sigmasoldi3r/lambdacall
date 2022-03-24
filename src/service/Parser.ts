import AbstractService from '../lib/AbstractService'

export type SYMBOL = { type: 'symbol'; value: string }
export type OPERATOR = string
export type STRING = { type: 'string'; value: string }
export type NUMBER = { type: 'number'; value: number }

export type Arg = SYMBOL

export interface Bop {
  type: 'binary'
  op: OPERATOR
  left: Expr
  right: Expr
}

export interface Application {
  type: 'application'
  args: Expr[]
  target: SYMBOL
  bindings: Assign[]
}

export interface Binding {
  type: 'binding'
  target: SYMBOL
  bindings: Assign[]
}

export type Literal = SYMBOL | STRING | NUMBER

export interface Abstraction {
  type: 'abstraction'
  expr: Expr
  args: Arg[]
  bindings: Assign[]
}

export type Terminal = Abstraction | Application | Literal | Binding

export type Expr = Bop | Terminal

export interface Assign {
  type: 'assign'
  target: SYMBOL
  def: Expr
}

export interface Script {
  type: 'script'
  defs: Assign[]
}

/**
 * Creates abstract syntax trees from resource buffers.
 */
export interface Parser {
  parse(source: string | Buffer): Promise<Script>
}

export default AbstractService<Parser>()
