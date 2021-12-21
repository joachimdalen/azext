# Demo Task

A task to to demo

Current version: 0.3.3

## Demo Task - Example

```yaml
- task: Demo Task@0.3.3
  inputs:
    mode: replace #Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values)
    inputType: file #Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly
    content: #String content containing the variables
    inputFile: .env #Input file to perform transformation on
    outputFile: .env #File to write transformed values to
    preserveComments: false #If `true`, comments from input are preserved when file is written

```

## Demo Task - Table

| Option             | Default Value | Required | Help                                                                                                                                                                                                                 | Visible                 | Options                 |
| :----------------- | :------------ | :------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------- | :---------------------- |
| `mode`             | `replace`     |    ❌    | Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) | --                      | `replace`, `substitute` |
| `inputType`        | `file`        |    ✅    | Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly                                                                                     | --                      | `file`, `inline`        |
| `content`          | --            |    ❌    | String content containing the variables                                                                                                                                                                              | `inputType` IS `inline` | --                      |
| `inputFile`        | `.env`        |    ❌    | Input file to perform transformation on                                                                                                                                                                              | `inputType` IS `file`   | --                      |
| `outputFile`       | `.env`        |    ❌    | File to write transformed values to                                                                                                                                                                                  | --                      | --                      |
| `preserveComments` | `false`       |    ❌    | If `true`, comments from input are preserved when file is written                                                                                                                                                    | --                      | --                      |


## Demo Task - Field - Output Variables

| Name            | Description                                     |
| :-------------- | :---------------------------------------------- |
| SomeOutput      | Contains information about the output           |
| DifferentOutput | Contains information about the different output |


## Demo Task - Field - Handle Json

[{"name":"mode","type":"pickList","label":"Mode","defaultValue":"replace","required":false,"helpMarkDown":"Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) ","options":{"replace":"Replace by keys","substitute":"Replace by values"}},{"name":"inputType","type":"pickList","label":"Input Mode","defaultValue":"file","required":true,"options":{"file":"File","inline":"Inline"},"helpMarkDown":"Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly"},{"name":"content","type":"multiLine","label":"Content","visibleRule":"inputType = inline","helpMarkDown":"String content containing the variables "},{"name":"inputFile","type":"string","label":"Input File","defaultValue":".env","helpMarkDown":"Input file to perform transformation on","required":false,"visibleRule":"inputType = file"},{"name":"outputFile","type":"string","label":"Output File","defaultValue":".env","helpMarkDown":"File to write transformed values to","required":false},{"name":"preserveComments","type":"boolean","label":"Preserve Comments","defaultValue":false,"helpMarkDown":"If `true`, comments from input are preserved when file is written"}]

## Demo Task - Field - Handle Json-Pretty

_Will be pretty in the markdown file, but not in rendered markup_

[
  {
    "name": "mode",
    "type": "pickList",
    "label": "Mode",
    "defaultValue": "replace",
    "required": false,
    "helpMarkDown": "Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) ",
    "options": {
      "replace": "Replace by keys",
      "substitute": "Replace by values"
    }
  },
  {
    "name": "inputType",
    "type": "pickList",
    "label": "Input Mode",
    "defaultValue": "file",
    "required": true,
    "options": {
      "file": "File",
      "inline": "Inline"
    },
    "helpMarkDown": "Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly"
  },
  {
    "name": "content",
    "type": "multiLine",
    "label": "Content",
    "visibleRule": "inputType = inline",
    "helpMarkDown": "String content containing the variables "
  },
  {
    "name": "inputFile",
    "type": "string",
    "label": "Input File",
    "defaultValue": ".env",
    "helpMarkDown": "Input file to perform transformation on",
    "required": false,
    "visibleRule": "inputType = file"
  },
  {
    "name": "outputFile",
    "type": "string",
    "label": "Output File",
    "defaultValue": ".env",
    "helpMarkDown": "File to write transformed values to",
    "required": false
  },
  {
    "name": "preserveComments",
    "type": "boolean",
    "label": "Preserve Comments",
    "defaultValue": false,
    "helpMarkDown": "If `true`, comments from input are preserved when file is written"
  }
]

## Demo Task - Field - Handle Json-Pretty - Code Format

```json
[
  {
    "name": "mode",
    "type": "pickList",
    "label": "Mode",
    "defaultValue": "replace",
    "required": false,
    "helpMarkDown": "Replace mode replces variables based on the key while subsitute only replaces Azure Pipelines variable syntax values `$(Pipeline.Workdir)`. Accepts `replace` (Replace by keys) and `substitute` (Replace by values) ",
    "options": {
      "replace": "Replace by keys",
      "substitute": "Replace by values"
    }
  },
  {
    "name": "inputType",
    "type": "pickList",
    "label": "Input Mode",
    "defaultValue": "file",
    "required": true,
    "options": {
      "file": "File",
      "inline": "Inline"
    },
    "helpMarkDown": "Input type to read initial values from. `file` will read from a file in the repo. `inline` will add to the file content directly"
  },
  {
    "name": "content",
    "type": "multiLine",
    "label": "Content",
    "visibleRule": "inputType = inline",
    "helpMarkDown": "String content containing the variables "
  },
  {
    "name": "inputFile",
    "type": "string",
    "label": "Input File",
    "defaultValue": ".env",
    "helpMarkDown": "Input file to perform transformation on",
    "required": false,
    "visibleRule": "inputType = file"
  },
  {
    "name": "outputFile",
    "type": "string",
    "label": "Output File",
    "defaultValue": ".env",
    "helpMarkDown": "File to write transformed values to",
    "required": false
  },
  {
    "name": "preserveComments",
    "type": "boolean",
    "label": "Preserve Comments",
    "defaultValue": false,
    "helpMarkDown": "If `true`, comments from input are preserved when file is written"
  }
]
```

# Partial Include

```yaml
- task: DemoTask@0.3.3
  inputs:
    mode: replace
    inputType: file
    content: "some content here"
    inputFile: .env
    outputFile: .env
    preserveComments: false

```
