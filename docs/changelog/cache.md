# Metadata cache

The `changelog cache` command updated the metadata cache. Currently it will check the changelog file for any issues and pull requests that have not been cached - and write them to the cache.

## Help

```text
> azext changelog generate help
```

[//]: # "#help-definition[command=changelog,cache,help]"

```text

Command List

  help   Print this usage guide.

Cache

  Refresh issue and pull request cache for changelog generation

Options

  --fresh string             Ignore existing cache and reload all
  -c, --config-name string   File name of configuration file. Default: changelog-config.json
  -l, --log-name string      File name of changelog entry file. Default: changelog.json
  --cache-name string

Global Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado

```

[//]: # "#help-definition[end]"
