import React from 'react';

import { AuthProvider } from './auth';
import { SearchProvider } from './search';
import { RecipeProvider } from './recipes';
import { SingleRecipeProvider } from './singleRecipe';
import { CookProvider } from './cook';
import { ExploreProvider } from './explore';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <RecipeProvider>
        <SingleRecipeProvider>
          <SearchProvider>
            <CookProvider>
              <ExploreProvider>
                {children}
              </ExploreProvider>
            </CookProvider>
          </SearchProvider>
        </SingleRecipeProvider>
      </RecipeProvider>
    </AuthProvider>
  );
};

export default AppProvider;
