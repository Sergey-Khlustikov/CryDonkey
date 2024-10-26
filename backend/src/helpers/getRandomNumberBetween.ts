interface IOptions {
  withDecimals: boolean;
}

function getRandomNumberBetween(min: number, max: number, options: IOptions = {withDecimals: false}): number {
  const randomNum = Math.random() * (max - min) + min;

  return options.withDecimals ? parseFloat(randomNum.toFixed(2)) : Math.floor(randomNum);
}

export default getRandomNumberBetween;
