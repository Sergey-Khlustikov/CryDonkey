function vLessOrEqualThan(value: number, targetValue: number): true | string {
  return value <= targetValue || `Value should be less than ${targetValue}`;
}

export default vLessOrEqualThan;
