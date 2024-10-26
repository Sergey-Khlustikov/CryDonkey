function vRequired(value) {
  return (value !== null && value !== '') || 'Field is required.';
}

export default vRequired;
