function vMoreThan(value: number, targetValue: number): true | string {
  return value > targetValue || `Value should be more than ${targetValue}`;
}

export default vMoreThan;
