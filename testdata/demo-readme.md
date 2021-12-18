# Demo Task

{{ #task-field[task=demo-task;field=description] }}

Current version: {{ #task-field[task=demo-task;field=version] }}

## Demo Task - Example

{{ #task-input[task=demo-task;type=example] }}

## Demo Task - Table

{{ #task-input[task=demo-task;type=table] }}

## Demo Task - Field - Output Variables

{{ #task-field[task=demo-task;field=outputVariables;] }}

## Demo Task - Field - Handle Json

{{ #task-field[task=demo-task;field=inputs;objectHandle=json] }}

## Demo Task - Field - Handle Json-Pretty

_Will be pretty in the markdown file, but not in rendered markup_

{{ #task-field[task=demo-task;field=inputs;objectHandle=json-pretty] }}

## Demo Task - Field - Handle Json-Pretty - Code Format

{{ #task-field[task=demo-task;field=inputs;codeFormat=json;objectHandle=json-pretty] }}

# Partial Include

{{ #include-partial[file=env-usage-one;wrap=yaml] }}
