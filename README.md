# Python Poetry

[Python Poetry](https://python-poetry.org/) support for [VS Code](https://code.visualstudio.com/) to manage Poetry commands.

[![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zeshuaro.vscode-python-poetry)](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry)
[![GitHub license](https://img.shields.io/github/license/zeshuaro/vscode-poetry)](https://github.com/zeshuaro/vscode-poetry/blob/main/LICENSE)
[![GitHub Actions](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml/badge.svg)](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=vscode-poetry&metric=coverage)](https://sonarcloud.io/summary/new_code?id=vscode-poetry)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vscode-poetry&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vscode-poetry)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Installation

Python Poetry can be installed from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry) or by [searching within VS Code](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension).

## Features

You can activate the commands by launching the command palette (View > Command Palette) and enter the command name.

### Commands

| Command Palette                    | Poetry command                  | Description                                                                            |
| ---------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| Install packages                   | `poetry install`                | Read the `pyproject.toml` file, resolve the packages, and install them                 |
| Install packages (with options)    | `poetry install [--options]`    | Install the packages with additional options                                           |
| Add packages                       | `poetry add <package>`          | Add required packages to your `pyproject.toml` and install them                        |
| **Deprecated** Add dev packages    | `poetry add --dev <package>`    | **Deprecated**, use `Add packages` instead. Add required dev packages and install them |
| Remove packages                    | `poetry remove <package>`       | Remove packages from the current list of installed packages                            |
| **Deprecated** Remove dev packages | `poetry remove --dev <package>` | **Deprecated**, use `Remove packages` instead. Remove dev packages                     |
| Update all packages                | `poetry update`                 | Update all packages from the current list of installed packages                        |
| Update all packages (with options) | `poetry update  [--options]`    | Update all packages with additional options                                            |
| Update all packages (ignore dev)   | `poetry update --no-dev`        | Update all packages without the dev packages                                           |
| Update selected packages           | `poetry update <package>`       | Update selected packages                                                               |
| Lock packages                      | `poetry lock`                   | Lock the packages specified in `pyproject.toml`                                        |
| Lock packages (no update)          | `poetry lock --no-update`       | Lock the packages without updating the locked versions                                 |
