export default function removeInProgressRecipe(type, recipeID) {
  const oldInProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));

  const recipesToUpdate = { ...oldInProgressRecipes[type] };

  delete recipesToUpdate[recipeID];

  const newRecipesInProgress = {
    ...oldInProgressRecipes,
    [type]: recipesToUpdate,
  };

  localStorage.setItem('inProgressRecipes', JSON.stringify(newRecipesInProgress));
}
