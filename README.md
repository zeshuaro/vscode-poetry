# Python Poetry

[![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zeshuaro.vscode-python-poetry)](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry)
[![GitHub license](https://img.shields.io/github/license/zeshuaro/vscode-poetry)](https://github.com/zeshuaro/vscode-poetry/blob/main/LICENSE)
[![GitHub Actions](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml/badge.svg)](https://github.com/zeshuaro/vscode-poetry/actions/workflows/github-actions.yml)
[![codecov](https://codecov.io/github/zeshuaro/vscode-poetry/graph/badge.svg?token=JNWUUW0XDE)](https://codecov.io/github/zeshuaro/vscode-poetry)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4306efc3445c4dc59f56315fff073e96)](https://app.codacy.com/gh/zeshuaro/vscode-poetry/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[![Github-sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/zeshuaro)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/zeshuaro)
[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/zeshuaro)
[![LiberaPay](https://img.shields.io/badge/Liberapay-F6C915?style=for-the-badge&logo=liberapay&logoColor=black)](https://liberapay.com/zeshuaro/)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/zeshuaro)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/JoshuaTang)

[Python Poetry](https://python-poetry.org/) support for [VS Code](https://code.visualstudio.com/) to manage Poetry commands.


## Installation

Python Poetry can be installed from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=zeshuaro.vscode-python-poetry) or by [searching within VS Code](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension).

## Features

You can activate the commands by launching the command palette (View > Command Palette) and enter the command name.

### Commands

| Command Palette                                 | Poetry command                  | Description                                                                                                    |
| ----------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Install packages                                | `poetry install`                | Read the `pyproject.toml` file, resolve the packages, and install them                                         |
| Install packages (with options)                 | `poetry install [--options]`    | Install the packages with additional options                                                                   |
| Add packages                                    | `poetry add <package>`          | Add required packages to your `pyproject.toml` and install them                                                |
| **Deprecated** Add dev packages                 | `poetry add --dev <package>`    | **Deprecated**, use `Add packages` instead. Add required dev packages and install them                         |
| Remove packages                                 | `poetry remove <package>`       | Remove packages from the current list of installed packages                                                    |
| **Deprecated** Remove dev packages              | `poetry remove --dev <package>` | **Deprecated**, use `Remove packages` instead. Remove dev packages                                             |
| Update all packages                             | `poetry update`                 | Update all packages from the current list of installed packages                                                |
| Update all packages (with options)              | `poetry update  [--options]`    | Update all packages with additional options                                                                    |
| **Deprecated** Update all packages (ignore dev) | `poetry update --no-dev`        | **Deprecated**, use `Update all packages (with options)` instead. Update all packages without the dev packages |
| Update selected packages                        | `poetry update <package>`       | Update selected packages                                                                                       |
| Lock packages                                   | `poetry lock`                   | Lock the packages specified in `pyproject.toml`                                                                |
| Lock packages (no update)                       | `poetry lock --no-update`       | Lock the packages without updating the locked versions                                                         |
