# TaskOneTwo Extension

This is the documentation for Task1 and Task2

# Task 1

This is some documentation for task 1. Current version is: 0.3.3

## Use the task

```yaml
- task: Task1@0
  inputs:
    mode: replace #Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values)
    inputType: file #Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly
    content: #String content containing the variables
    inputFile: .env #Input file to perform transformation on
    outputFile: .env #File to write transformed values to
    preserveComments: false #If `true`, comments from input are preserved when file is written

```

### Valid Options

| Option             | Default Value | Required | Help                                                                                                                                                                                                                 | Visible                 | Options                 |
| :----------------- | :------------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- | :---------------------- |
| `mode`             | `replace`     |    ❌    | Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) | --                      | `replace`, `substitute` |
| `inputType`        | `file`        |    ✅    | Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly                                                                                     | --                      | `file`, `inline`        |
| `content`          | --            |    ❌    | String content containing the variables                                                                                                                                                                              | `inputType` IS `inline` | --                      |
| `inputFile`        | `.env`        |    ❌    | Input file to perform transformation on                                                                                                                                                                              | `inputType` IS `file`   | --                      |
| `outputFile`       | `.env`        |    ❌    | File to write transformed values to                                                                                                                                                                                  | --                      | --                      |
| `preserveComments` | `false`       |    ❌    | If `true`, comments from input are preserved when file is written                                                                                                                                                    | --                      | --                      |


### Output variables

These are the output variables the task sets:

| Name            | Description                                     |
| :-------------- | :---------------------------------------------- |
| SomeOutput      | Contains information about the output           |
| DifferentOutput | Contains information about the different output |


# Task 2

This is some documentation for task 1. Current version is: 0.3.3

## Use the task

```yaml
- task: Task2@0
  inputs:
    mode: replace #Some additional help with [markdown link](#)
    inputType: file
    content:
    inputFile: .env #Input file to perform transformation on
    outputFile: .env #File to write transformed values to
    preserveComments: false

```

### Valid Options

| Option             | Default Value | Required | Help                                         | Visible                 | Options                 |
| :----------------- | :------------ | :------: | :------------------------------------------- | :---------------------- | :---------------------- |
| `mode`             | `replace`     |    ❌    | Some additional help with [markdown link](#) | --                      | `replace`, `substitute` |
| `inputType`        | `file`        |    ✅    | --                                           | --                      | `file`, `inline`        |
| `content`          | --            |    ❌    | --                                           | `inputType` IS `inline` | --                      |
| `inputFile`        | `.env`        |    ❌    | Input file to perform transformation on      | `inputType` IS `file`   | --                      |
| `outputFile`       | `.env`        |    ❌    | File to write transformed values to          | --                      | --                      |
| `preserveComments` | `false`       |    ❌    | --                                           | --                      | --                      |


### Output variables

These are the output variables the task sets:

| Name            | Description                                     |
| :-------------- | :---------------------------------------------- |
| SomeOutput      | Contains information about the output           |
| DifferentOutput | Contains information about the different output |


