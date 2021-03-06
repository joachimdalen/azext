# Commands

README generation supports a set of dynamic commands to add data to your documentation.

Commnds are on the format: `#command[option1=option1-value;option2=option2-value]`

Supported commands:

- [Task Input](#task-input)
- [Task Field](#task-field)
- [Include Image](#include-image)

## Task Input

The task usage command parses your `task.json` and generates examples of how to use your task.

**Command:** `task-input`

| Parameter | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| task      | Key of task defined in `.azext/mapping.json`                                   |
| type      | The type of usage example to generate. Valid options are `table` and `example` |

### Example

> {{ #task-input[task=demo-task;type=example] }}

**Generates:**

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

### Table

Columns can be configured in `.azext/readme.json`. By default the following columns are included

- name
- defaultValue
- required
- helpMarkDown
- visibleRule

> {{ #task-input[task=demo-task;type=table] }}

**Generates:**

| Option             | Default Value | Required | Help                                    |
| :----------------- | :------------ | :------: | :-------------------------------------- |
| `mode`             | `replace`     |    ❌    | --                                      |
| `inputType`        | `file`        |    ✅    | --                                      |
| `content`          | --            |    ✅    | --                                      |
| `inputFile`        | `.env`        |    ❌    | Input file to perform transformation on |
| `outputFile`       | `.env`        |    ❌    | File to write transformed values to     |
| `preserveComments` | `false`       |    ✅    | --                                      |

## Task Field

The task fild command parses your `task.json` and extracts data.

**Command:** `task-field`

| Parameter    | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| task         | Key of task defined in `mapping.json`                             |
| field        | The field to fetch data from                                      |
| objectHandle | How to handle objects. Valid options are `json` and `json-pretty` |
| codeFormat   | Wraps the field in a code block                                   |

## Example

```md
Version: {{ #task-input[task=demo-task;field=version] }}
```

Version: 0.3.3

## Include Image

The command allows you to include images that might be located in different places for different files, such as one location for documentation on GitHub and another one located in your extension.

This requires the profile to be set in `readme.json`.

```json
"profiles": [
  {
    "name": "github",
    "imageFolder": "docs/images",
    "relative": true
  },
  {
    "name": "marketplace",
    "imageFolder": "marketplace/images"
  }
]
```

**Command:** `include-image`

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| imagePath | Relative path to your image based on the profile folder |

```md
{{ #include-image[imagePath=azext-icon.png] }}
```
