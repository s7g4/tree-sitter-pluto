function sepByNewline($, rule) {
  return seq(
    rule, 
    repeat(seq($._statement_separator, rule)), 
    optional($._statement_separator)
  );
}

// Helper function to create binary operation rules
const PRECEDENCE = {
  command: 1,
  argument: 2,
  expression: 3,
  assignment: 5,
  conditional: 7,        // Lowered: ternary should have lower precedence than comparisons
  logical_or: 8,
  logical_and: 9,
  equality: 10,
  comparison: 11,        // Lowered to be higher than conditional
  bitwise_or: 12,
  bitwise_xor: 13,
  bitwise_and: 14,
  shift: 15,
  add: 16,
  mult: 17,
  power: 18,
  unary: 19,
  postfix: 20,
  primary: 21,
};

function createBinaryOp($, operators, precedence) {
  return operators.map(operator =>
    prec.left(PRECEDENCE[precedence], seq(
      field('left', $._expression),
      field('operator', alias(token(operator), $.operator)),
      field('right', $._expression)
    ))
  );
}

module.exports = grammar({
  name: 'pluto',

  word: $ => $.identifier,

  conflicts: $ => [
    [$.binary_operation, $.postfix_operation],
    [$.binary_operation, $.unary_operation, $.postfix_operation],
    [$.argument_list,$._expression],
    [$.conditional_expression,$.unary_operation, $.postfix_operation],
    [$.conditional_expression,$.binary_operation, $.postfix_operation],
    [$._statement, $.if_statement],
    [$.empty_line],
    [$.assignment, $.argument_list],
    [$._expression],
  ],


  extras: $ => [
    token(prec(-1, /[ \t\r\n]/)),  // Handle horizontal whitespace, but not newlines
    $.comment,
    $.line_continuation,
  ],

  rules: {
    source_file: $ => sepByNewline($, $._statement),

    // Empty line handling
    empty_line: $ => seq(
      token('\n'),
      repeat(token('\n'))
    ),

    _statement_separator: $ => token(/\n+/),

    block_comment_statement: $ => $.block_comment,

    _statement: $ => choice(
      $.assignment,
      $.block_comment_statement,
      prec.right(PRECEDENCE.command, $.command),
      $.if_statement,
      $.while_loop,
      $.for_loop,
      $.function_definition
    ),

    // Reserved keywords that cannot be used as arguments
    reserved_keyword: $ => choice(
      'if', 'else', 'while', 'for', 'function', 'return', 'break', 'continue',
      'try', 'catch', 'finally', 'throw', 'import', 'export', 'from',
      'class', 'extends', 'super', 'static', 'public', 'private', 'protected',
      'const', 'let', 'var', 'new', 'delete', 'typeof', 'instanceof',
      'in', 'of', 'with', 'switch', 'case', 'default', 'do', 'async', 'await',
      'yield', 'enum', 'interface', 'type', 'namespace', 'module', 'declare',
      'abstract', 'implements', 'readonly', 'keyof', 'unique', 'infer',
      'never', 'unknown', 'object', 'string', 'number', 'boolean', 'symbol',
      'bigint', 'void', 'any', 'null', 'undefined', 'true', 'false',
      'this', 'arguments', 'eval', 'NaN', 'Infinity', 'globalThis',
      'package', 'protected', 'goto', 'volatile', 'transient', 'synchronized',
      'native', 'strictfp', 'final', 'abstract', 'assert', 'byte', 'char',
      'double', 'float', 'int', 'long', 'short', 'match', 'case', 'where',
      'when', 'unless', 'until', 'loop', 'repeat', 'select', 'defer',
      'go', 'chan', 'range', 'fallthrough', 'struct', 'map', 'slice',
      'interface', 'type', 'func', 'var', 'const', 'package', 'import',
      'and', 'or', 'not', 'is', 'as', 'pass', 'lambda', 'global', 'nonlocal',
      'with', 'raise', 'except', 'finally', 'def', 'class', 'yield', 'from',
      'async', 'await', 'match', 'case', 'None', 'True', 'False'
    ),

    // Assignment with single or multiple targets
    assignment: $ => prec.right(PRECEDENCE.assignment, seq(
      field("left", seq(
        $.identifier,
        repeat(seq($.identifier))
      )),
      optional(field("type", $.type_annotation)),
      token('='),
      field("right", $._expression)
    )),

    // Command with optional arguments
    command: $ => prec.left(PRECEDENCE.command, seq(
      field("name", $.identifier),
      optional(field("arguments", $.argument_list))
    )),

    // Argument list handles space-separated arguments but stops at reserved keywords
    argument_list: $ => prec(PRECEDENCE.argument, repeat1(
      choice(
        $.parenthesized_expression,
        $.binary_operation,
        $.string,
        $.number,
        $.boolean,
        // Only allow identifiers that are NOT reserved keywords
        prec.dynamic(-1, $.identifier)
      ))
    ),

    // Conditional (ternary) operator
    conditional_expression: $ => prec.right(PRECEDENCE.conditional, seq(
      field('condition', $._expression),
      token('?'),
      field('consequence', $._expression),
      token(':'),
      field('alternative', $._expression)
    )),

    // Comprehensive binary operations
    binary_operation: $ => choice(
      // Logical operators
      ...createBinaryOp($, ['||'], 'logical_or'),
      ...createBinaryOp($, ['&&'], 'logical_and'),
      
      // Equality operators
      ...createBinaryOp($, ['==', '!=', '===', '!=='], 'equality'),
      
      // Comparison operators
      ...createBinaryOp($, ['<', '>', '<=', '>='], 'comparison'),
      
      // Bitwise operators
      ...createBinaryOp($, ['|'], 'bitwise_or'),
      ...createBinaryOp($, ['^'], 'bitwise_xor'),
      ...createBinaryOp($, ['&'], 'bitwise_and'),
      
      // Shift operators
      ...createBinaryOp($, ['<<', '>>', '>>>'], 'shift'),
      
      // Arithmetic operators
      ...createBinaryOp($, ['+', '-'], 'add'),
      ...createBinaryOp($, ['*', '/', '%'], 'mult'),
      ...createBinaryOp($, ['**'], 'power'),
      
      // String operations
      ...createBinaryOp($, ['++'], 'add'),
      ...createBinaryOp($, ['in'], 'comparison'),
      ...createBinaryOp($, ['matches'], 'comparison'),
    ),

    // Expression hierarchy
    _expression: $ => choice(
      $.conditional_expression,
      $.binary_operation,
      $.unary_operation,
      $.postfix_operation,
      $.parenthesized_expression,
      $.array_literal,
      $.object_literal,
      $.string,
      $.number,
      $.boolean,
      $.identifier,
    ),

    // Unary operations
    unary_operation: $ => prec.right(PRECEDENCE.unary, seq(
      field('operator', alias(choice(
        token('-'),
        token('+'),
        token('!'),
        token('~'),
        token('++'),
        token('--'),
        token('typeof'),
        token('not')
      ), $.operator)),
      field('argument', $._expression)
    )),

    // Postfix operations
    postfix_operation: $ => prec.left(PRECEDENCE.postfix, seq(
      field('operand', $._expression),
      field('operator', alias(choice(
        token('++'),
        token('--'),
        token('?'),
        token('!')
      ), $.operator))
    )),

    // Parenthesized expressions
    parenthesized_expression: $ => seq(
      token('('),
      $._expression,
      token(')')
    ),

    // Array literals
    array_literal: $ => seq(
      token('['),
      optional(seq(
        $._expression,
        repeat(seq(token(','), $._expression)),
        optional(token(','))
      )),
      token(']')
    ),

    // Object literals
    object_literal: $ => prec(2, seq(
      token('{'),
      optional(seq(
        $.object_pair,
        repeat(seq(token(','), $.object_pair)),
        optional(token(','))
      )),
      token('}')
    )),

    object_pair: $ => seq(
      field('key', choice($.identifier, $.string, $.computed_property)),
      token(':'),
      field('value', $._expression)
    ),

    computed_property: $ => seq(
      token('['),
      $._expression,
      token(']')
    ),

    // Type annotations
    type_annotation: $ => seq(
      token(':'),
      $.type_expression
    ),

    type_expression: $ => choice(
      $.identifier,
      $.generic_type,
      $.union_type,
      $.array_type,
      $.function_type
    ),

    generic_type: $ => seq(
      $.identifier,
      token('<'),
      $.type_expression,
      repeat(seq(token(','), $.type_expression)),
      token('>')
    ),

    union_type: $ => prec.left(1, seq(
      $.type_expression,
      repeat1(seq(token('|'), $.type_expression))
    )),

    array_type: $ => prec(2, seq(
      $.type_expression,
      token('['),
      token(']')
    )),

    function_type: $ => prec.right(seq(
      token('('),
      optional(seq(
        $.type_expression,
        repeat(seq(token(','), $.type_expression))
      )),
      token(')'),
      token('=>'),
      $.type_expression
    )),



    // Terminal patterns - identifier now excludes reserved keywords
    identifier: $ => token(prec(-1, /[a-zA-Z_\u00a1-\uffff][a-zA-Z0-9_\u00a1-\uffff]*/)),

    // Number support
    number: $ => token(choice(
      // Scientific notation
      /\d+[eE][+-]?\d+/,
      /\d*\.\d+[eE][+-]?\d+/,
      // Hexadecimal
      /0[xX][0-9a-fA-F]+/,
      // Binary
      /0[bB][01]+/,
      // Octal
      /0[oO][0-7]+/,
      // BigInt
      /\d+n/,
      // Decimals
      /\d*\.\d+/,
      // Integers
      /\d+/
    )),

    // String support
    string: $ => choice(
      // Double quoted strings
      token(seq(
        '"',
        repeat(choice(
          /[^"\\$]+/,
          /\\./
        )),
        '"'
      )),
      // Single quoted strings
      token(seq(
        "'",
        repeat(choice(
          /[^'\\]+/,
          /\\./
        )),
        "'"
      ))
    ),

    string_content: $ => token.immediate(/[^"\\$]+/),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[\\'"nrtbfav0]/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
        /U[0-9a-fA-F]{8}/,
        /[0-7]{1,3}/,
        /./
      )
    )),

    // Boolean and null values
    boolean: $ => token(choice('true', 'false')),
    null: $ => token('null'),
    undefined: $ => token('undefined'),
    this: $ => token('this'),
    super: $ => token('super'),

    // Comments
    comment: $ => token(seq('#', /.*/)),
    
    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    line_continuation: $ => token(seq('\\', choice('\n', '\r\n'))),

    // Function definitions
    function_definition: $ => seq(
      token('function'),
      field('name', $.identifier),
      token('('),
      optional($.parameter_list),
      token(')'),
      optional(seq(token('->'), $.type_expression)),
      $.block
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(token(','), $.parameter))
    ),

    parameter: $ => seq(
      $.identifier,
      optional($.type_annotation),
      optional(seq(token('='), $._expression))
    ),

    block: $ => prec(1, seq(
      token('{'),
      repeat($._statement),
      token('}')
    )),

    // Control flow structures
    if_statement: $ => prec.right(seq(
      token('if'),
      field('condition', $._expression),
      field('consequence', choice($.block, $._statement)),
      optional(seq(
        token('else'),
        field('alternative', choice($.block, $._statement, $.if_statement))
      ))
    )),

    while_loop: $ => seq(
      token('while'),
      field('condition', $._expression),
      field('body', choice($.block, $._statement))
    ),

    for_loop: $ => seq(
      token('for'),
      field('variable', $.identifier),
      token('in'),
      field('iterable', $._expression),
      field('body', choice($.block, $._statement))
    ),


  }
});