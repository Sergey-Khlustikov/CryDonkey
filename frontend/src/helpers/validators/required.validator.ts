function vRequired(value: unknown): true | string {
  if (value === null || value === undefined) {
    return 'Field is required.';
  }

  if (typeof value === 'string') {
    return value.trim() !== '' || 'Field is required.';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) || 'Field is required.';
  }

  if (Array.isArray(value)) {
    return value.length > 0 || 'Field is required.';
  }

  return true;
}


export default vRequired;
