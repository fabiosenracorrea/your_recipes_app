export default function parseCategory(type, { area, category, alcoholicOrNot }) {
  switch (type) {
    case 'meals':
      return `${area} - ${category}`;
    case 'cocktails':
      return `${alcoholicOrNot}`;
    default:
      return null;
  }
}
