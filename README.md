# Python Poetry

[Python Poetry](https://python-poetry.org/) support for [VS Code](https://code.visualstudio.com/) to manage Poetry commands.

[![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zeshuaro.vscode-python-poetry)](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry)
[![GitHub license](https://img.shields.io/github/license/zeshuaro/vscode-poetry)](https://github.com/zeshuaro/vscode-poetry/blob/main/LICENSE)
[![GitHub Actions](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml/badge.svg)](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml)
[![codecov](https://codecov.io/gh/zeshuaro/vscode-poetry/branch/main/graph/badge.svg?token=JNWUUW0XDE)](https://codecov.io/gh/zeshuaro/vscode-poetry)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/49b5ec82beee426dbfacab87311960ee)](https://www.codacy.com/gh/zeshuaro/vscode-poetry/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zeshuaro/vscode-poetry&amp;utm_campaign=Badge_Grade)
[![DeepSource](https://deepsource.io/gh/zeshuaro/vscode-poetry.svg/?label=active+issues&token=qCAmnymVcLjqZmQOIYGhkArV)](https://deepsource.io/gh/zeshuaro/vscode-poetry/?ref=repository-badge)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Installation

Python Poetry can be installed from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry) or by [searching within VS Code](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension).

## Features

You can activate the commands by launching the command palette (View > Command Palette) and enter the command name.

### Commands

| Command Palette                        | Poetry command                  | Description                                                                              |
| -------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| Install packages                       | `poetry install`                | Read the `pyproject.toml` file, resolve the packages, and install them                   |
| Install packages (with options)        | `poetry install [--options]`    | Install the packages with additional options                                             |
| Add package(s)                         | `poetry add <package>`          | Add required packages to your `pyproject.toml` and install them                          |
| **[Deprecated]** Add dev package(s)    | `poetry add --dev <package>`    | **Deprecated**, use `Add package(s)` instead. Add required dev packages and install them |
| Remove package(s)                      | `poetry remove <package>`       | Remove packages from the current list of installed packages                              |
| **[Deprecated]** Remove dev package(s) | `poetry remove --dev <package>` | **Deprecated**, use `Remove package(s)` instead. Remove dev packages                     |
| Update all packages                    | `poetry update`                 | Update all packages from the current list of installed packages                          |
| Update all packages (ignore dev)       | `poetry update --no-dev`        | Update all packages without the dev packages                                             |
| Update selected package(s)             | `poetry update <package>`       | Update selected packages                                                                 |
| Lock packages                          | `poetry lock`                   | Lock the packages specified in `pyproject.toml`                                          |
| Lock packages (no update)              | `poetry lock --no-update`       | Lock the packages without updating the locked versions                                   |
