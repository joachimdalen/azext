# Demo Task

A task to to demo

Current version: 0.3.3

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

## Demo Task - Table

| Option             | Default Value | Required | Help                                    | Visible                 |
| :----------------- | :------------ | :------: | :-------------------------------------- | :---------------------- |
| `mode`             | `replace`     |    ❌    | --                                      | ``                      |
| `inputType`        | `file`        |    ✅    | --                                      | ``                      |
| `content`          | --            |    ❌    | --                                      | `inputType` IS `inline` |
| `inputFile`        | `.env`        |    ❌    | Input file to perform transformation on | `inputType` IS `file`   |
| `outputFile`       | `.env`        |    ❌    | File to write transformed values to     | ``                      |
| `preserveComments` | `false`       |    ❌    | --                                      | ``                      |


## Demo Task - Field - Handle Json

[{"name":"mode","type":"pickList","label":"Mode","defaultValue":"replace","required":false,"options":{"replace":"Replace by keys","substitute":"Replace by values"}},{"name":"inputType","type":"pickList","label":"Input Mode","defaultValue":"file","required":true,"options":{"file":"File","inline":"Inline"}},{"name":"content","type":"multiLine","label":"Content","visibleRule":"inputType = inline"},{"name":"inputFile","type":"string","label":"Input File","defaultValue":".env","helpMarkDown":"Input file to perform transformation on","required":false,"visibleRule":"inputType = file"},{"name":"outputFile","type":"string","label":"Output File","defaultValue":".env","helpMarkDown":"File to write transformed values to","required":false},{"name":"preserveComments","type":"boolean","label":"Preserve Comments","defaultValue":false}]

## Demo Task - Field - Handle Json-Pretty

[
  {
    "name": "mode",
    "type": "pickList",
    "label": "Mode",
    "defaultValue": "replace",
    "required": false,
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
    }
  },
  {
    "name": "content",
    "type": "multiLine",
    "label": "Content",
    "visibleRule": "inputType = inline"
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
    "defaultValue": false
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
    }
  },
  {
    "name": "content",
    "type": "multiLine",
    "label": "Content",
    "visibleRule": "inputType = inline"
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
    "defaultValue": false
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
