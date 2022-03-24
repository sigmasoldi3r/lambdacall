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

/**
 * Simple javascript code generation.
 */
@Service.provide()
export default class HppCodeGenerator implements CodeGenerator {
  readonly vars = new Map<string, Expr>()

  compileBinding(binding: Binding): string {
    const target = this.compileSymbol(binding.target)
    const val = this.vars.get(target)
    const out = this.compileExpr(val)
    return `([]() {
      ${binding.bindings.map(s => this.compileAssing(s, true)).join(';')}
      return ${out};
    })()`
  }

  compileAbstraction(abstraction: Abstraction): string {
    const out = `[](${abstraction.args
      .map(s => 'auto ' + this.compileSymbol(s))
      .join(', ')}) { return ${this.compileExpr(abstraction.expr)}; }`
    if (abstraction.bindings.length > 0) {
      return `([]() {
        ${abstraction.bindings.map(s => this.compileAssing(s, true)).join(';')}
        return ${out};
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
    const left = this.compileExpr(binary.left)
    const right = this.compileExpr(binary.right)
    if (binary.op === '·') {
      binary.op = '*'
    } else if (binary.op === '^') {
      return `pow(${left}, ${right})`
    }
    return `${left} ${binary.op} ${right}`
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

  isMain = false

  compileAssing(assign: Assign, isConst: boolean = false): string {
    const expr = this.compileExpr(assign.def)
    const target = this.compileSymbol(assign.target)
    if (target === 'main' && assign.def.type === 'abstraction') {
      this.isMain = true
      return `int main() { return ${this.compileExpr(assign.def.expr)}; }`
    }
    this.vars.set(target, assign.def)
    if (isConst) {
      return `const auto ${target} = ${expr};`
    } else {
      return `(${target} = ${expr})`
    }
  }

  async *generate(script: Script, source: string): AsyncIterable<Result> {
    const name = path.basename(source, path.extname(source))
    const root = path.dirname(source)
    const output = `${this.isMain ? '#pragma once\n' : ''}#include <iostream>
#include <tgmath.h>

#ifndef _STD_PRINT_DEF_
#define _STD_PRINT_DEF_
template <class... Args>
int print(Args... args)
{
  (std::cout << ... << args) << std::endl;
  return 0;
}
#endif

${script.defs.map(def => this.compileAssing(def, true)).join('\n')}
    `
    yield {
      target: path.join(root, `${name}.${this.isMain ? 'cpp' : 'hpp'}`),
      output,
    }
  }
}
