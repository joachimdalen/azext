# AzExt

Welcome to the documentation for AzExt.

## Cli Commands

- [Initialize AzExt](./init/index.md)
- [Manage Changelogs](./changelog/index.md)
- [Manage Documentation](./readme/index.md)

## Help

AzExt is divided into main and sub-commands. To get a list of the root commands that azext supports, issue the following command.

```text
> azext help
```

[//]: # "#help-definition[command=help]"

```text

Command List

  init        Generate default config folder
  changelog   Tools to manage and generate changelogs
  readme      Tools to manage and generate partial documentation
  help        Print this usage guide.

Global Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado

```

[//]: # "#help-definition[end]"

## Global options

```text
Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado
```

### CI Mode

CI mode currently only supports the key `ado` (Azure DevOps). This will integrate with the Task Agent, mostly in logging commands.
