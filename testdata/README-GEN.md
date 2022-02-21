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

| Argument                                   | Description                                                                                                                                                                                                                                                                                                 |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode` <br />Mode                          | **(Optional)** Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) <br /> Options: `replace`, `substitute` <br /> Default value: `replace` |
| `inputType` <br />Input Mode               | **(Required)** Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly <br /> Options: `file`, `inline` <br /> Default value: `file`                                                                                               |
| `content` <br />Content                    | **(Optional)** String content containing the variables <br />                                                                                                                                                                                                                                               |
| `inputFile` <br />Input File               | **(Optional)** Input file to perform transformation on <br /> Default value: `.env`                                                                                                                                                                                                                         |
| `outputFile` <br />Output File             | **(Optional)** File to write transformed values to <br /> Default value: `.env`                                                                                                                                                                                                                             |
| `preserveComments` <br />Preserve Comments | **(Optional)** If `true`, comments from input are preserved when file is written <br />                                                                                                                                                                                                                     |


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

| Argument                                   | Description                                                                                                                         |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `mode` <br />Mode                          | **(Optional)** Some additional help with [markdown link](#) <br /> Options: `replace`, `substitute` <br /> Default value: `replace` |
| `inputType` <br />Input Mode               | **(Required)** <br /> Options: `file`, `inline` <br /> Default value: `file`                                                        |
| `content` <br />Content                    | **(Optional)** <br />                                                                                                               |
| `inputFile` <br />Input File               | **(Optional)** Input file to perform transformation on <br /> Default value: `.env`                                                 |
| `outputFile` <br />Output File             | **(Optional)** File to write transformed values to <br /> Default value: `.env`                                                     |
| `preserveComments` <br />Preserve Comments | **(Optional)** <br />                                                                                                               |


### Output variables

These are the output variables the task sets:

| Name            | Description                                     |
| :-------------- | :---------------------------------------------- |
| SomeOutput      | Contains information about the output           |
| DifferentOutput | Contains information about the different output |


