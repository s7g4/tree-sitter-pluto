; =============================================================================
; PLUTO Language Syntax Highlighting
; =============================================================================

; Comments
(comment) @comment

; Keywords - Procedure structure
"procedure" @keyword.function
"preconditions" @keyword
"main" @keyword
"confirmation" @keyword
"end" @keyword

; Keywords - Control flow
"if" @keyword.control.conditional
"then" @keyword.control.conditional
"elsif" @keyword.control.conditional
"else" @keyword.control.conditional
"while" @keyword.control.repeat
"for" @keyword.control.repeat
"do" @keyword.control.repeat
"in" @keyword.control.repeat

; Keywords - Activity operations
"initiate" @keyword.function
"confirm" @keyword.function
"and" @keyword.operator
"wait" @keyword.function
"until" @keyword.function

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

; String literals
(string) @string

; Error nodes for debugging
(ERROR) @error