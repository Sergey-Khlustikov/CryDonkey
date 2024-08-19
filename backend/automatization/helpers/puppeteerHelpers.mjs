export function wait(minMs, maxMs) {
  // Генерируем случайное время ожидания в пределах заданного диапазона
  const waitTime = Math.random() * (maxMs - minMs) + minMs;
  // Возвращаем промис, который будет разрешен после указанного времени
  return new Promise(resolve => { setTimeout(resolve, waitTime); });
}

export async function scrollPage(page, options = {}) {
  const {
    tag = 'html', // Тег для прокрутки
    direction = 'down', // Направление прокрутки: 'down' или 'up'
    selector = null, // CSS-селектор для прокрутки до определенного элемента
    minDistance = 77, // Минимальное расстояние прокрутки
    maxDistance = 159, // Максимальное расстояние прокрутки
    minDelay = 79,
    maxDelay = 1021,
  } = options;

  // Определение целевой позиции на странице
  const targetPosition = await getScrollTargetPosition(page, tag, selector, direction);

  // Получение текущей позиции скролла
  let currentPosition = await page.evaluate(tag => document.querySelector(tag).scrollTop, tag);

  // Основной цикл скроллинга
  let shouldScroll = (direction === 'down' && currentPosition < targetPosition) || (direction === 'up' && currentPosition > targetPosition);

  while (shouldScroll) {
    // Рассчитываем случайное расстояние для скроллинга
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;
    const scrollBy = direction === 'down' ? distance : -distance;

    // Выполняем плавную прокрутку
    await page.evaluate(({
      scrollBy,
      tag,
    }) => {
      document.querySelector(tag).scrollBy({
        top: scrollBy,
        behavior: 'smooth',
      });
    }, {
      scrollBy,
      tag,
    });

    // Задержка для сохранения плавности между прокрутками
    await wait(minDelay, maxDelay);

    // Обновление текущей позиции после прокрутки
    currentPosition = await page.evaluate(tag => document.querySelector(tag).scrollTop, tag);

    // Проверка, нужно ли продолжать скроллинг
    shouldScroll = (direction === 'down' && currentPosition < targetPosition) || (direction === 'up' && currentPosition > targetPosition);

    // Остановка скроллинга при достижении целевой позиции или верха страницы
    if ((direction === 'up' && currentPosition <= targetPosition) || (direction === 'down' && currentPosition >= targetPosition)) {
      break;
    }
  }
}

async function getScrollTargetPosition(page, tag, selector, direction) {
  if (selector) {
    return await page.evaluate(selector => {
      const element = document.querySelector(selector);
      return element ? element.getBoundingClientRect().top + window.pageYOffset : 0;
    }, selector);
  }

  if (direction === 'down') {
    return await page.evaluate(tag => document.querySelector(tag).scrollHeight, tag);
  }

  return 0;
}

export async function hoverAndClick(locator) {
  await locator.hover();
  await wait(405, 1421);
  await locator.click();
}
