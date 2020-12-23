function extractRecipeInfo(type, recipe) {
  if (type === 'meals') {
    const {
      idMeal: id,
      strArea: area,
      strMeal: name,
      strCategory: category,
      strMealThumb: image,
      strTags: stringTags,
    } = recipe;

    const alcoholicOrNot = '';

    const tags = (stringTags ? stringTags.split(',') : []);

    return {
      id,
      area: (area || ''),
      name,
      category: (category || ''),
      image,
      tags,
      alcoholicOrNot,
      type: 'meals',
    };
  }

  const {
    idDrink: id,
    strDrink: name,
    strCategory: category,
    strDrinkThumb: image,
    strTags: stringTags,
    strAlcoholic: alcoholicOrNot,
  } = recipe;

  const area = '';

  const tags = (stringTags ? stringTags.split(',') : []);

  return {
    id,
    area,
    name,
    category: (category || ''),
    image,
    tags,
    alcoholicOrNot,
    type: 'cocktails',
  };
}

function parseDateToDisplayFormat(rawDate) {
  const day = rawDate.getDate();
  const month = rawDate.getMonth() + 1; // JS months start at 0.
  const year = rawDate.getFullYear();

  const parsedDate = `${month}/${day}/${year}`;

  const [time] = rawDate.toTimeString().split(' ');
  const [hours, minutes] = time.split(':');
  const parsedTime = `${hours}:${minutes}`;

  const parsedDoneDate = `${parsedTime} - ${parsedDate}`;

  return parsedDoneDate;
}

export default function saveDoneRecipe(type, recipe) {
  const previouslyDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];

  const newRecipeInfoParsed = extractRecipeInfo(type, recipe);

  const date = new Date(Date.now());
  const doneDate = parseDateToDisplayFormat(date);

  const recipeToAdd = { ...newRecipeInfoParsed, doneDate };

  const newDoneRecipes = [...previouslyDoneRecipes, recipeToAdd];

  localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));

  return newDoneRecipes;
}