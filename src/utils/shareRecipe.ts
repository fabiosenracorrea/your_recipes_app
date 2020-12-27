import copy from 'clipboard-copy';

import { tRecipeTypes } from '../@types/appTypes';

type updateCopiedStateCallback = (check: boolean) => void;

interface multipleIDTrack {
  [id: string]: boolean;
}

type updateMultipleCopiedStateCallback = (track: multipleIDTrack) => void;

export function shareWhenSingleRecipePresent(
  id: string,
  type: tRecipeTypes,
  updateCallback: updateCopiedStateCallback,
): void {
  const url = `${process.env.REACT_APP_APP_URL}/${type}/${id}`;

  copy(url);

  updateCallback(true);

  const DISPLAYED_TEXT_TIME = 2000;

  setTimeout(() => {
    updateCallback(false);
  }, DISPLAYED_TEXT_TIME);
}

export function shareWhenMultipleRecipesPresent(
  id: string,
  type: tRecipeTypes,
  updateCallback: updateMultipleCopiedStateCallback,
): void {
  const url = `${process.env.REACT_APP_APP_URL}/${type}/${id}`;

  copy(url);

  const copiedRecipe = {
    [id]: true,
  };

  updateCallback(copiedRecipe);

  const DISPLAYED_TEXT_TIME = 2000;

  setTimeout(() => {
    updateCallback({});
  }, DISPLAYED_TEXT_TIME);
}
