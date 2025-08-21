; Comments
(comment) @comment

; Keywords
"procedure" @keyword.function
"preconditions" @keyword
"main" @keyword
"confirmation" @keyword
"end" @keyword

; Keywords
"if" @keyword.control.conditional
"then" @keyword.control.conditional
"elsif" @keyword.control.conditional
"else" @keyword.control.conditional
"while" @keyword.control.repeat
"for" @keyword.control.repeat
"do" @keyword.control.repeat
"in" @keyword.control.repeat

; Keywords
"initiate" @keyword.function
"confirm" @keyword.function
"and" @keyword.operator
"wait" @keyword.function
"until" @keyword.function

; Type system keywords
"namespace" @keyword.other
"type" @keyword.type
"struct" @keyword.type

; Primitive types
[
  "u8" "u16" "u32" "u64"
  "i8" "i16" "i32" "i64"
  "f32" "f64"
  "bool"
  "string"
] @type.builtin

; Operators - Arithmetic
[
  "+"
  "-"
  "*"
  "/"
  "mod"
  "**"
] @operator.arithmetic

; Operators - Comparison
[
  "=="
  "!="
  "<>"
  "<"
  ">"
  "<="
  ">="
] @operator.comparison

; Operators - Logical
[
  "and"
  "or"
  "not"
] @operator.logical

; Assignment operator
"=" @operator.assignment

; Punctuation
[
  "("
  ")"
  ";"
  ","
  "."
] @punctuation.delimiter

; Brackets for struct definitions
[
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

; Literals
(string) @string
(number) @number
(boolean) @constant.builtin.boolean

; Units and measurements
(unit) @type.builtin

; Identifiers
(identifier) @variable

; Procedure names
(procedure_name (identifier) @function)

; Activity references
(activity_reference (identifier) @function.call)

; Property access
(property_access
  (identifier) @variable
  (identifier) @property) @variable.member

; Function calls
(function_call
  (identifier) @function.call)

; Parameter names in function calls
(parameter
  (identifier) @parameter
  "=" @operator.assignment)

; Value with unit
(value_with_unit
  (number) @number
  (unit) @type.builtin)

; Type declarations
(type_declaration
  (identifier) @type)

; Struct fields
(field_declaration
  (identifier) @property
  (type_annotation) @type)

; Namespace declarations
(namespace_declaration
  (namespace_path) @module)

; Namespace paths
(namespace_path (identifier) @module)

; Type annotations
(type_annotation) @type

; Error
(ERROR) @error
