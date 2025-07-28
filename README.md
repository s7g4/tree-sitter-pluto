# Tree Sitter Pluto

A Tree-sitter parser for the Pluto language. This parser is designed for syntax highlighting and editor support, such as integration with a Zed extension.

---

## Table of Contents
- [Tree Sitter Pluto](#tree-sitter-pluto)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation and Setup](#installation-and-setup)
    - [Step 1: Install Node.js and npm](#step-1-install-nodejs-and-npm)
    - [Step 2: Install Tree-sitter CLI](#step-2-install-tree-sitter-cli)
    - [Step 3: Create the Project Directory](#step-3-create-the-project-directory)
    - [Step 4: Initialize the Tree-sitter Project](#step-4-initialize-the-tree-sitter-project)
    - [Step 5: Updating grammar.js with Pluto Grammar](#step-5-updating-grammarjs-with-pluto-grammar)
    - [Step 6: Running Tree-sitter Commands](#step-6-running-tree-sitter-commands)
      - [Generate the Parser](#generate-the-parser)
      - [Build the Parser](#build-the-parser)
    - [Step 7: Push to GitHub](#step-7-push-to-github)
  - [Creating a Zed Extension](#creating-a-zed-extension)
  - [References and Acknowledgments](#references-and-acknowledgments)

---

## Overview

This project implements a Tree-sitter parser for Pluto.

## Installation and Setup

To start, make sure you have Node.js and npm installed, as Tree-sitter uses npm for setup. You’ll also need the Tree-sitter CLI tool, which can be installed via npm.

### Step 1: Install Node.js and npm

Download and install [Node.js](https://nodejs.org/), which includes npm.

### Step 2: Install Tree-sitter CLI

Install the Tree-sitter CLI globally:
```bash
npm install -g tree-sitter-cli
```


### Step 3: Create the Project Directory

Create a new directory for the Tree-sitter parser:

```bash
mkdir tree-sitter-pluto
cd tree-sitter-pluto
```

### Step 4: Initialize the Tree-sitter Project

Run the following command to initialize your Tree-sitter project. This creates a grammar.js file and package.json:

```bash
tree-sitter init
```

### Step 5: Updating grammar.js with Pluto Grammar

The grammar for Pluto can be derived from Pluto language official resources.


### Step 6: Running Tree-sitter Commands

Once `grammar.js` is updated, you can use the following commands to generate, build, and test your parser.

#### Generate the Parser

```bash
tree-sitter generate
```

#### Build the Parser

```bash
tree-sitter build
```

### Step 7: Push to GitHub



## Creating a Zed Extension

To use this Tree-sitter parser in a Zed extension for syntax highlighting and other features, refer to the [pluto project on GitHub](https://github.com/s7g4/pluto).

For more information on creating Zed extensions, refer to the [official Zed documentation](https://zed.dev/docs/extensions).


## References and Acknowledgments

Many thanks to the following resources for guidance and support in creating this extension:

1. [Installing Extensions in Zed](https://zed.dev/docs/extensions/installing-extensions) - Guide to setting up and installing extensions in Zed.
2. [Zed Decoded: Extensions Blog Post](https://zed.dev/blog/zed-decoded-extensions) - Insights on how Zed handles extensions and the possibilities they open.
















