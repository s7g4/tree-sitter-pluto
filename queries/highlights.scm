; Comments
(comment) @comment
(block_comment) @comment

; Keywords - only using string literals that exist in our grammar
"if" @keyword.control
"else" @keyword.control
"while" @keyword.control
"for" @keyword.control
"function" @keyword.function
"in" @keyword

; Operators
(operator) @operator

; Assignment operator
"=" @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  ","
  ":"
  "?"
] @punctuation.bracket

; Literals
(string) @string
(number) @number
(boolean) @constant.builtin

; Identifiers
(identifier) @variable

; Function calls
(command
  name: (identifier) @function.call)

; Function definitions
(function_definition
  name: (identifier) @function)

; Assignment targets
(assignment
  left: (identifier) @variable)

; Array and object literals
(array_literal) @punctuation.bracket
(object_literal) @punctuation.bracket

; Built-in constants are handled by the boolean token above

; Error nodes
(ERROR) @error
