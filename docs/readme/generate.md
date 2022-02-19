# Generate

Generate documentation from partial files and replacement commands. For a full list of supported commands, see [Commands](./commands.md).

A full example of usage can be seen in the [raw file](../../testdata/demo-readme.md) and the [generated file](../../testdata/demo-readme-replaced.md)

## Help

```text
> azext readme generate help
```

[//]: # "#help-definition[command=readme,generate,help]"

```text

Generate

  Generate readme from partial files

Command List

  help   Print this usage guide.

Options

  --input string     Input file containing the template
  --output string    Output file to write replaced value to
  --profile string   Image profile to handle file paths

Global Options

  --ci string   Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado

```

[//]: # "#help-definition[end]"
