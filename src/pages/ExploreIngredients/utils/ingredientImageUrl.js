export default function getIngredientUrl(type, ingredient) {
  switch (type) {
  case 'meals':
    return `https://www.themealdb.com/images/ingredients/${ingredient}.png`;
  case 'cocktails':
    return `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;
  default:
    return null;
  }
}
