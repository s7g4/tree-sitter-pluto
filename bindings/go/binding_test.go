package tree_sitter_pluto_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_pluto "github.com/tree-sitter/tree-sitter-pluto/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_pluto.Language())
	if language == nil {
		t.Errorf("Error loading PLUTO grammar")
	}
}
