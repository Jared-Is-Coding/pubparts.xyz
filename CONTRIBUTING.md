# Contributing

Welcome. Thanks for your interest in helping out with maintaining this library of resources!

When contributing to this repository, please first discuss the change you wish to make via the Discord [project thread](https://discord.com/channels/846794200308908065/1278080689039867935). Bug fixes, resource/item submissions, and spelling corrections are always welcome.

> [!TIP]
> Before getting started, please see the [README.md](https://github.com/Jared-Is-Coding/pubparts.xyz/blob/master/README.md) for steps to get a local development environment set up.

Table of Contents:
- [Repository Setup](#repository-setup)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Commenting](#code-commenting)
- [Code Regions](#code-regions)

## Submitting Changes

### Commits
- Commit titles should be less than 72 characters and use `Sentence case` where applicable.
- Commit descriptions should include a thoughtful description of the change(s) being introduced
- For longer commit descriptions, break information into lists using a `-` at the beginning of newlines

### Pull Requests
- Each commit should be an independent change
- Use *rebase workflow* for all PRs
- If addressing pull request review comments, update original commits with fixes belonging to them, then force-push. This keeps things tidy.

## Code Conventions

### Imports
- Clean up unnecessary imports

### File Naming
- Files containing complete classes or components should use `PascalCase`
- Files containing pages should be `lowercase`
- Pretty much everything else should use `camelCase`

### Code Naming
- Type names should use `PascalCase`
- Pretty much everything else should use `camelCase`

### Comments
- Comments should plainly summarize the purpose of the code
- Files containing a default export should include a [TSDoc](https://tsdoc.org/)-formatted comment with:
    1. a summary of the export
    2. any input parameters expected and their purpose
    3. any returned value(s)

> [!TIP]
> Resource list files do not need to include a file summary comment. Instead, please ensure that the page(s) where the list is included detail what the list is displaying.

### Code Regions
- Longer sections of related code may be organized using `#region` and `#endregion` tags
- `#region` tags should be follow by the region title (e.g. `#region Classes`) and terminated using `#endregion`

## Resources and Helpful Things

### Visual Studio Code
- `.vscode/launch.json` contains debug launch configurations for use with `Debug: Start Debugging`. This allows for pressing F5 (by default) to start the gatsby development server.
- `.vscode/PubPartsSnippets.code-snippets` contains useful starter blocks for resource list additions. Hopefully this can save some boilerplate copy/pasting.
- `.vscode/settings.json` contains workspace settings for things like the [cSpell](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) package dictionary.

### Documentation
- [Node Version Manager (Windows)](https://github.com/coreybutler/nvm-windows)
- [Node Version Manager (Linux)](https://github.com/nvm-sh/nvm)
- [Gatsby](https://www.gatsbyjs.com/docs/)
- [React-Bootstrap Documentation](https://react-bootstrap.netlify.app/docs)
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3)
- [React Icons](https://react-icons.github.io/react-icons)