function normalizeString(str: string): string {
  return str.replace(/\s+/g, '').trim().toLowerCase();
}

export default normalizeString;
