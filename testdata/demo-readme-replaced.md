# Demo Task

{{ task_description }}

# Example

```yaml
- task: Demo Task@0.3.3
  inputs:
    mode: replace
    inputType: file
    content:
    inputFile: .env #Input file to perform transformation on
    outputFile: .env #File to write transformed values to
    preserveComments: false

```

# Table

| Option             | Default Value | Required | Help                                    |
| :----------------- | :------------ | :------: | :-------------------------------------- |
| `mode`             | `replace`     |    ✅    | --                                      |
| `inputType`        | `file`        |    ✅    | --                                      |
| `content`          | --            |    ✅    | --                                      |
| `inputFile`        | `.env`        |    ✅    | Input file to perform transformation on |
| `outputFile`       | `.env`        |    ✅    | File to write transformed values to     |
| `preserveComments` | `false`       |    ✅    | --                                      |

