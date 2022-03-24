# Lambdacall lang

A toy language inspired by [Alonozo Church's lambda notation][lambda.wiki].

The aim of this language is to create templates for functions that can be used
later on, on other languages like Javascript and C++.

Also the compiler itself was created in order to further develop the abstractions
needed to have multiple targets within the same language.

[lambda.wiki]: https://en.wikipedia.org/wiki/Lambda_calculus

## Examples

You can check out the `examples/` folder to see the language in action.

A hello world:

```fs
(* This constitutes a main module, which can be used as an entry point: *)
main := (λargs. (print "Hello world!"))
```

If no `main` symbol is defined, the whole script is considered a module
and produces library-like code.

_Note:_ For sake of simplicity the symbol `λ` can be replaced by a `\`, if
the flag `--permissive` is passed.
