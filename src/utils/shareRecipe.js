import copy from 'clipboard-copy';

export function shareWhenSingleRecipePresent(id, type, updateCallback) {
  const url = `${process.env.REACT_APP_APP_URL}/${type}/${id}`;

  copy(url);

  updateCallback(true);

  const DISPLAYED_TEXT_TIME = 2000;

  setTimeout(() => {
    updateCallback(false);
  }, DISPLAYED_TEXT_TIME);
}

export async function shareWhenMultipleRecipesPresent(id, type, updateCallback) {
  const url = `${process.env.REACT_APP_APP_URL}/${type}/${id}`;

  await copy(url);

  const copiedRecipe = {
    [id]: true,
  };

  updateCallback(copiedRecipe);

  const DISPLAYED_TEXT_TIME = 2000;

  setTimeout(() => {
    updateCallback({});
  }, DISPLAYED_TEXT_TIME);
}
