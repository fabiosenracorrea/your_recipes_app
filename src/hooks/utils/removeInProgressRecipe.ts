export default function removeInProgressRecipe(type: string, recipeID: string): void {
  const oldSavedProgress = localStorage.getItem('inProgressRecipes');

  if (oldSavedProgress) {
    const oldInProgressRecipes = JSON.parse(oldSavedProgress);

    const recipesToUpdate = { ...oldInProgressRecipes[type] };

    delete recipesToUpdate[recipeID];

    const newRecipesInProgress = {
      ...oldInProgressRecipes,
      [type]: recipesToUpdate,
    };

    localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipesInProgress));
  }
}
