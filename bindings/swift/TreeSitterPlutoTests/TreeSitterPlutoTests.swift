import XCTest
import SwiftTreeSitter
import TreeSitterPluto

final class TreeSitterPlutoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_pluto())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading PLUTO grammar")
    }
}
