{
  const permissive = this.options.options.permissive
}

Script = _* defs:(@Assign _*)* {
  return { type: 'script', defs  }
}

Assign = target:SYMBOL _* ':=' _* def:Expr {
  return { type: 'assign', target, def }
}

PartialBinding = bindings:(@Binding _*)+ _* target:SYMBOL {
  return { type: 'binding', target, bindings }
}

Abstraction "Abstraction" = bindings:(@Binding _*)* '(' args:(_* @Arg)+ _* expr:Expr ')' {
  return { type: 'abstraction', expr, args, bindings }
}

Binding = '[' _* @Assign _* ']'

Arg = LAMBDA @SYMBOL '.'

Expr = Bop / Terminal

Terminal = Abstraction / Application / Literal / PartialBinding / '{' @Expr '}'

Application "Application expression" = bindings:(@Binding _*)* '(' target:SYMBOL args:(_+ @Expr)* ')' {
  return { type: 'application', target, args, bindings }
}

Bop "Binary expression" = left:Terminal _* op:OPERATORS _* right:Expr {
  return { type: 'binary', op, left, right }
}

Literal = NUMBER / SYMBOL / STRING

OPERATORS "Binary operator" = $([+\/\-*$%&|?'@·^]+)

NUMBER "Number" = value:$([0-9]+ ('.' [0-9]+)?) {
  return { type: 'number', value: Number(value) }
}

STRING "String" = '"' value:$(!'"' .)* '"' {
  return { type: 'string', value }
}

SYMBOL = value:$([A-Za-z_¿!¡$ºª][A-Za-z0-9_¿!¡$ºª]*) {
  return { type: 'symbol', value }
}

COMMENT "Block comment" = '(*' (!'*)' .)* '*)'

LAMBDA = e:('λ' / '\\') {
  if (!permissive && e !== 'λ') {
    throw new SyntaxError(`Can't compile (\\x.x) style expressions without the --permissive flag! at line ${location().start.line}`)
  }
}

_ = [\n\r\t ] / COMMENT
