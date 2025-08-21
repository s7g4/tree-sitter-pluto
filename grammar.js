module.exports = grammar({
  name: "pluto",

  extras: ($) => [/\s+/, $.comment],

  conflicts: ($) => [
    [$.initiate_only],
    [$.initiate_and_confirm],
    [$.activity_reference, $.primary_expression],
  ],

  word: ($) => $.identifier,

  rules: {
    // Support both official ECSS procedures and custom type definitions
    source_file: ($) =>
      repeat(choice($.procedure, $.namespace_declaration, $.type_declaration)),

    // Main procedure structure (OFFICIAL)
    procedure: ($) =>
      seq(
        "procedure",
        $.procedure_name,
        optional($.preconditions_block),
        $.main_block,
        optional($.confirmation_block),
        "end",
        "procedure",
      ),

    procedure_name: ($) => $.identifier,

    // Block structures (OFFICIAL)
    preconditions_block: ($) =>
      seq(
        "preconditions",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        "end",
        "preconditions",
      ),

    main_block: ($) =>
      seq(
        "main",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        "end",
        "main",
      ),

    confirmation_block: ($) =>
      seq(
        "confirmation",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        "end",
        "confirmation",
      ),

    // Statements (OFFICIAL)
    statement: ($) =>
      choice(
        $.activity_call,
        $.wait_until_statement,
        $.assignment,
        $.conditional,
        $.loop,
        $.expression_statement,
      ),

    // Wait until statement (OFFICIAL)
    wait_until_statement: ($) =>
      seq("wait", "until", $.expression, optional(";")),

    // Activity calls (OFFICIAL)
    activity_call: ($) =>
      choice($.initiate_and_confirm, $.initiate_only, $.confirm_only),

    initiate_and_confirm: ($) =>
      seq(
        "initiate",
        "and",
        "confirm",
        $.activity_reference,
        optional($.parameter_list),
        optional(";"),
      ),

    initiate_only: ($) =>
      seq(
        "initiate",
        $.activity_reference,
        optional($.parameter_list),
        optional(";"),
      ),

    confirm_only: ($) =>
      seq(
        "confirm",
        choice(
          prec(2, seq($.activity_reference, optional($.parameter_list))),
          prec(1, $.expression),
        ),
        optional(";"),
      ),

    activity_reference: ($) => choice($.identifier, $.property_access),

    parameter_list: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) =>
      choice($.expression, seq($.identifier, "=", $.expression)),

    // Assignment (OFFICIAL)
    assignment: ($) => seq($.identifier, "=", $.expression, optional(";")),

    // Conditional statements (OFFICIAL)
    conditional: ($) =>
      seq(
        "if",
        $.expression,
        "then",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        repeat($.elsif_clause),
        optional($.else_clause),
        "end",
        "if",
      ),

    elsif_clause: ($) =>
      seq(
        "elsif",
        $.expression,
        "then",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
      ),

    else_clause: ($) =>
      seq(
        "else",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
      ),

    // Loop statements (OFFICIAL)
    loop: ($) => choice($.while_loop, $.for_loop),

    while_loop: ($) =>
      seq(
        "while",
        $.expression,
        "do",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        "end",
        "while",
      ),

    for_loop: ($) =>
      seq(
        "for",
        $.identifier,
        "in",
        $.expression,
        "do",
        repeat(
          choice(
            $.activity_call,
            $.wait_until_statement,
            $.assignment,
            $.conditional,
            $.loop,
            $.expression_statement,
          ),
        ),
        "end",
        "for",
      ),

    // Namespace declaration (CUSTOM)
    namespace_declaration: ($) =>
      seq(
        "namespace",
        $.namespace_path,
        "{",
        repeat(choice($.type_declaration, $.namespace_declaration)),
        "}",
      ),

    namespace_path: ($) => seq($.identifier, repeat(seq(".", $.identifier))),

    // Type declarations (CUSTOM)
    type_declaration: ($) => seq("type", $.identifier, $.type_definition),

    type_definition: ($) =>
      choice($.struct_type, $.primitive_type, $.array_type),

    struct_type: ($) => seq("struct", "{", repeat($.field_declaration), "}"),

    field_declaration: ($) =>
      seq($.identifier, $.type_annotation, optional(",")),

    type_annotation: ($) =>
      choice($.primitive_type, $.identifier, $.array_type),

    primitive_type: ($) =>
      choice(
        "u8",
        "u16",
        "u32",
        "u64",
        "i8",
        "i16",
        "i32",
        "i64",
        "f32",
        "f64",
        "bool",
        "string",
      ),

    array_type: ($) => seq("[", $.type_annotation, ";", $.number, "]"),

    // Expression statement - lowest precedence
    expression_statement: ($) => prec(-1, seq($.expression, optional(";"))),

    // Expression hierarchy (OFFICIAL)
    expression: ($) => $.logical_or_expression,

    logical_or_expression: ($) =>
      prec.left(
        1,
        choice(
          $.logical_and_expression,
          seq($.logical_or_expression, "or", $.logical_and_expression),
        ),
      ),

    logical_and_expression: ($) =>
      prec.left(
        2,
        choice(
          $.equality_expression,
          seq($.logical_and_expression, "and", $.equality_expression),
        ),
      ),

    equality_expression: ($) =>
      prec.left(
        3,
        choice(
          $.relational_expression,
          seq(
            $.equality_expression,
            choice("==", "!=", "<>"),
            $.relational_expression,
          ),
        ),
      ),

    relational_expression: ($) =>
      prec.left(
        4,
        choice(
          $.additive_expression,
          seq(
            $.relational_expression,
            choice("<", ">", "<=", ">="),
            $.additive_expression,
          ),
        ),
      ),

    additive_expression: ($) =>
      prec.left(
        5,
        choice(
          $.multiplicative_expression,
          seq(
            $.additive_expression,
            choice("+", "-"),
            $.multiplicative_expression,
          ),
        ),
      ),

    multiplicative_expression: ($) =>
      prec.left(
        6,
        choice(
          $.exponential_expression,
          seq(
            $.multiplicative_expression,
            choice("*", "/", "mod"),
            $.exponential_expression,
          ),
        ),
      ),

    exponential_expression: ($) =>
      prec.right(
        7,
        choice(
          $.unary_expression,
          seq($.unary_expression, "**", $.exponential_expression),
        ),
      ),

    unary_expression: ($) =>
      choice(
        $.primary_expression,
        prec(8, seq("not", $.unary_expression)),
        prec(8, seq("-", $.unary_expression)),
        prec(8, seq("+", $.unary_expression)),
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.boolean,
        $.property_access,
        $.function_call,
        $.parenthesized_expression,
        $.value_with_unit,
      ),

    // Property access (OFFICIAL)
    property_access: ($) =>
      prec.left(9, seq($.identifier, repeat1(seq(".", $.identifier)))),

    // Function calls (OFFICIAL)
    function_call: ($) =>
      prec.left(
        9,
        seq(
          $.identifier,
          "(",
          optional(seq($.parameter, repeat(seq(",", $.parameter)))),
          ")",
        ),
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    // Value with unit (OFFICIAL)
    value_with_unit: ($) => seq($.number, $.unit),

    // Literals (OFFICIAL)
    number: ($) =>
      token(
        seq(
          /\d+/,
          optional(seq(".", /\d+/)),
          optional(seq(/[eE]/, optional(/[+-]/), /\d+/)),
        ),
      ),

    string: ($) =>
      choice(
        seq('"', repeat(choice(/[^"\\]/, seq("\\", /./))), '"'),
        seq("'", repeat(choice(/[^'\\]/, seq("\\", /./))), "'"),
      ),

    boolean: ($) => choice("true", "false"),

    // Units for measurements (OFFICIAL - comprehensive space operations units)
    unit: ($) =>
      token(
        choice(
          // Temperature
          "degC",
          "degF",
          "K",

          // Angular
          "deg",
          "rad",
          "deg/h",
          "deg/s",
          "deg/min",
          "rad/s",
          "rad/min",
          "mrad",
          "urad",
          "arcsec",
          "arcmin",

          // Distance/Length
          "m",
          "km",
          "mm",
          "cm",
          "um",
          "nm",
          "ft",
          "in",
          "mil",

          // Time
          "s",
          "min",
          "h",
          "ms",
          "us",
          "ns",
          "day",
          "hr",

          // Electrical
          "V",
          "mV",
          "kV",
          "A",
          "mA",
          "uA",
          "W",
          "mW",
          "kW",
          "MW",
          "Ohm",
          "kOhm",
          "MOhm",
          "F",
          "uF",
          "nF",
          "pF",
          "H",
          "mH",
          "uH",

          // Frequency
          "Hz",
          "kHz",
          "MHz",
          "GHz",
          "rpm",
          "cps",

          // Pressure
          "Pa",
          "kPa",
          "MPa",
          "bar",
          "mbar",
          "psi",
          "atm",
          "Torr",
          "mmHg",

          // Mass/Weight
          "kg",
          "g",
          "mg",
          "ug",
          "lb",
          "oz",
          "ton",
          "tonne",

          // Force
          "N",
          "mN",
          "kN",
          "MN",
          "lbf",
          "kgf",
          "dyne",

          // Energy/Work
          "J",
          "kJ",
          "MJ",
          "Wh",
          "kWh",
          "MWh",
          "cal",
          "kcal",
          "BTU",
          "eV",

          // Power density
          "W/m2",
          "mW/cm2",
          "W/kg",

          // Velocity/Speed
          "m/s",
          "km/h",
          "km/s",
          "ft/s",
          "mph",
          "knot",

          // Acceleration
          "m/s2",
          "g",
          "ft/s2",

          // Magnetic
          "T",
          "mT",
          "uT",
          "nT",
          "Gauss",
          "Wb",
          "Wb/m2",

          // Flow
          "l/s",
          "l/min",
          "l/h",
          "m3/s",
          "m3/min",
          "m3/h",
          "gal/min",
          "cfm",

          // Percentage and dimensionless
          "%",
          "ppm",
          "ppb",
          "percent",
          "dB",
          "dBm",
          "dBW",

          // Data/Information
          "bit",
          "byte",
          "kB",
          "MB",
          "GB",
          "TB",
          "bps",
          "kbps",
          "Mbps",
          "Gbps",

          // Concentration
          "mol/m3",
          "mol/l",
          "mg/l",
          "ug/m3",
          "ppm",
          "ppb",

          // Radiation
          "Gy",
          "Sv",
          "rad",
          "rem",
          "Ci",
          "Bq",
          "R",
        ),
      ),

    // Identifiers (OFFICIAL)
    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,

    // Comments (OFFICIAL)
    comment: ($) => token(seq("#", /.*/)),
  },
});
