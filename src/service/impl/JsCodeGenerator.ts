import path = require('path')
import Service, { CodeGenerator, Result } from '../CodeGenerator'
import {
  Abstraction,
  Application,
  Assign,
  Binding,
  Bop,
  Expr,
  NUMBER,
  Script,
  STRING,
  SYMBOL,
} from '../Parser'
import * as prettier from 'prettier'

/**
 * Simple javascript code generation.
 */
@Service.provide()
export default class JsCodeGenerator implements CodeGenerator {
  readonly vars = new Map()

  compileBinding(binding: Binding): string {
    const target = this.compileSymbol(binding.target)
    const out = this.compileExpr(this.vars.get(target))
    return `(() => {
      ${binding.bindings.map(s => this.compileAssing(s, true)).join(';')}
      return ${out}
    })()`
  }

  compileAbstraction(abstraction: Abstraction): string {
    const out = `(${abstraction.args
      .map(s => this.compileSymbol(s))
      .join(', ')}) => ${this.compileExpr(abstraction.expr)}`
    if (abstraction.bindings.length > 0) {
      return `(() => {
        ${abstraction.bindings.map(s => this.compileAssing(s, true)).join(';')}
        return ${out}
      })()`
    }
    return out
  }

  compileApplication(application: Application): string {
    return `${this.compileSymbol(application.target)}(${application.args
      .map(s => this.compileExpr(s))
      .join(', ')})`
  }

  compileBinary(binary: Bop): string {
    console.warn('WARN: Redefine binary operators', binary)
    if (binary.op === '·') {
      binary.op = '*'
    } else if (binary.op === '^') {
      binary.op = '**'
    }
    return `${this.compileExpr(binary.left)} ${binary.op} ${this.compileExpr(
      binary.right
    )}`
  }

  compileSymbol(symbol: SYMBOL): string {
    console.warn('WARN: Redefine symbol', symbol)
    return symbol.value
  }

  compileString(str: STRING): string {
    return `"${str.value}"`
  }

  compileNumber(num: NUMBER): string {
    return num.value.toString()
  }

  compileExpr(expr: Expr): string {
    switch (expr.type) {
      case 'abstraction':
        return this.compileAbstraction(expr)
      case 'application':
        return this.compileApplication(expr)
      case 'binary':
        return this.compileBinary(expr)
      case 'symbol':
        return this.compileSymbol(expr)
      case 'string':
        return this.compileString(expr)
      case 'number':
        return this.compileNumber(expr)
      case 'binding':
        return this.compileBinding(expr)
    }
  }

  compileAssing(assign: Assign, isConst: boolean = false): string {
    const expr = this.compileExpr(assign.def)
    const target = this.compileSymbol(assign.target)
    this.vars.set(target, assign.def)
    if (isConst) {
      return `const ${target} = ${expr}`
    } else {
      return `(${target} = ${expr})`
    }
  }

  async *generate(script: Script, source: string): AsyncIterable<Result> {
    const name = path.basename(source, path.extname(source))
    const root = path.dirname(source)
    const output = `"use strict";
    const print = (...args) => console.log(...args)
      ${script.defs.map(def => this.compileAssing(def, true)).join(';')}
      main(process.argv)
    `
    yield {
      target: path.join(root, `${name}.js`),
      output: prettier.format(output),
    }
  }
}
