export const getRandomInt = (max) => Math.floor(Math.random() * max);
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
