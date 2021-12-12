export const logInfo = (text: string) => {
  console.log(`##[command]${text}`);
};

export const logError = (text: string) => {
  console.log(`##[error]${text}`);
};

export const logWarning = (text: string) => {
  console.log(`##[error]${text}`);
};

export const setVariable = (
  name: string,
  value: string,
  isSecret = false,
  isOutput = false,
  isReadOnly = false
) => {
  let text = '';

  text = appendIf(text, 'issecret=true;', isSecret);
  text = appendIf(text, 'isreadonly=true;', isReadOnly);
  text = appendIf(text, 'isoutput=true;', isOutput);
  console.log(`##vso[task.setvariable variable=${name};${text}]${value}`);
};

const appendIf = (text: string, append: string, condition: boolean) => {
  if (condition) return text + append;
  return text;
};
