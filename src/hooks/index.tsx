import React, { ReactChildren } from 'react';

import { AuthProvider } from './auth';
import { SearchProvider } from './search';
import { RecipeProvider } from './recipes';
import { SingleRecipeProvider } from './singleRecipe';
import { CookProvider } from './cook';
import { ExploreProvider } from './explore';

interface iAppProviderProps {
  children: ReactChildren;
}

const AppProvider: React.FC<iAppProviderProps> = ({ children }) => {
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
}

export default AppProvider;
