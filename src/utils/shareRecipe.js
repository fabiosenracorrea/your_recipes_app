import copy from 'clipboard-copy';

export function shareWhenSingleRecipePresent(id, type, updateCallback) {
  const url = `http://localhost:3000/${type}/${id}`;

  copy(url);

  updateCallback(true);

  const DISPLAYED_TEXT_TIME = 2000;

  setTimeout(() => {
    updateCallback(false);
  }, DISPLAYED_TEXT_TIME);
}

export async function shareWhenMultipleRecipesPresent(id, type, updateCallback) {
  const url = `http://localhost:3000/${type}/${id}`;

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
