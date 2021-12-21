# Changelog Generation

The `changelog generate` command generates a new changelog markdown file.

## Example

Even though this project is not an extension for Azure DevOps, we still use azext for changelog generation.

Here are our files that are used for changelog generation.

- [Changelog configuration](../../.azext/changelog-config.json)
- [Generated changelog](../CHANGELOG.md)
- [Generated cache](../../.azext/changelog-cache.json)

## Help

```text
> azext changelog generate help
```

[//]: # "#help-definition[command=changelog,generate,help]"

```text

Generate

  Generate changelog markdown file

Command List

  help   Print this usage guide.

Options

  -o, --output string        Full path to output generated markdown file to
  -c, --config-name string   File name of configuration file. Default: changelog-config.json
  -l, --log-name string      File name of changelog entry file. Default: changelog.json
  --format                   Format generated file. Requires Prettier to be installed
  --generate-cache           Generate changelog-cache.json containing a cache of issues and pull requests
  --from-cache               Load issues and pull requests from cache file before GitHub
  --cache-file string
  --version string           Generate changelog for only this version. Maps to the version field of
                             changelog.json

Global Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado

```

[//]: # "#help-definition[end]"
