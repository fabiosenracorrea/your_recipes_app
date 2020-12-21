interface iDesiredCategories {
  category?: string;
  area?: string;
  alcoholicOrNot?: string;
}

export default function parseCategory(type: string, { area, category, alcoholicOrNot }: iDesiredCategories) {
  switch (type) {
    case 'meals':
      return `${area} - ${category}`;
    case 'cocktails':
      return `${alcoholicOrNot}`;
    default:
      return null;
  }
}
