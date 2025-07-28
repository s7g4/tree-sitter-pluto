; Comments can contain other languages
(comment) @injection.content
(#set! injection.language "comment")

; String interpolation for shell commands
(string) @injection.content
(#match? @injection.content "\\$\\{.*\\}")
(#set! injection.language "bash")
