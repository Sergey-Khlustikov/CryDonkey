interface IOptions {
  removeSpaces?: boolean;
}

function normalizeString(str: string, options: IOptions = {removeSpaces: true}): string {
  const result = options.removeSpaces ? str.replace(/\s+/g, '') : str;

  return result.toLowerCase().trim();
}

export default normalizeString;
