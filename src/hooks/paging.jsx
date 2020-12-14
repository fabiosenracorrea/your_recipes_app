import { useState, useMemo, useCallback } from 'react';

export default function usePaging(recipes) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState(1);

  const numberOfPages = useMemo(() => {
    const totalRecipes = recipes.length;
    const recipesPerPage = 12;

    const pages = Math.ceil(totalRecipes / recipesPerPage);

    return pages;
  }, [recipes]);

  const pageGenerator = useMemo(() => {
    const maxNumberOfPagesShown = 6;

    const generator = (
      Array
        .from(
          { length: numberOfPages },
          (_, index) => index + 1,
        )
        .filter((page) => {
          const lastPageToShow = paging + maxNumberOfPagesShown;

          let pageInDesiredRange;
          let pageIsWithinLimit;

          if (lastPageToShow <= numberOfPages) {
            pageInDesiredRange = (page >= paging);
            pageIsWithinLimit = page < (lastPageToShow);

            return (pageInDesiredRange && pageIsWithinLimit);
          }

          pageInDesiredRange = (page <= numberOfPages);
          pageIsWithinLimit = page > (numberOfPages - maxNumberOfPagesShown);

          return (pageInDesiredRange && pageIsWithinLimit);
        })
    );

    return generator;
  }, [numberOfPages, paging]);

  const lastShownPage = useMemo(() => {
    const lastItemIndex = pageGenerator.length - 1;

    const lastPage = pageGenerator[lastItemIndex];

    return lastPage;
  }, [pageGenerator]);

  const shownRecipesByPage = useMemo(() => {
    const recipesToShow = recipes.filter((_, index) => {
      const recipesPerPage = 12;

      const MIN_INDEX = currentPage * recipesPerPage - recipesPerPage;
      const MAX_INDEX = currentPage * recipesPerPage;

      const recipeInPageRange = (index >= MIN_INDEX && index < MAX_INDEX);

      return recipeInPageRange;
    });

    return recipesToShow;
  }, [currentPage, recipes]);

  const handlePageChange = useCallback(({ target }) => {
    const selectedPage = Number(target.value);

    if (selectedPage <= numberOfPages) {
      setCurrentPage(selectedPage);
      setPaging(selectedPage);
    }
  }, [numberOfPages]);

  const handlePageDown = useCallback(() => {
    const MINIMUM_PAGING = 1;

    const possibleNewPaging = paging - 1;

    if (possibleNewPaging >= MINIMUM_PAGING) {
      setPaging(possibleNewPaging);
    }
  }, [paging]);

  const handlePageUp = useCallback(() => {
    const MAX_PAGING = numberOfPages;

    const possibleNewPaging = paging + 1;

    if (possibleNewPaging <= MAX_PAGING) {
      setPaging(possibleNewPaging);
    }
  }, [numberOfPages, paging]);

  const resetPaging = useCallback(() => {
    setPaging(1);
    setCurrentPage(1);
  }, []);

  return {
    paging,
    currentPage,
    numberOfPages,
    shownRecipesByPage,
    pageGenerator,
    lastShownPage,
    handlePageDown,
    handlePageUp,
    handlePageChange,
    resetPaging,
  };
}
