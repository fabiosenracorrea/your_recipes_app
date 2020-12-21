import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Recipes from '../pages/Recipes';
import RecipeDetails from '../pages/RecipeDetails';
import RecipeInProgress from '../pages/RecipeInProgress';
import Profile from '../pages/Profile';
import DoneRecipes from '../pages/DoneRecipes';
import Explore from '../pages/Explore';
import Favorites from '../pages/Favorites';
import ExploreRecipes from '../pages/ExploreRecipes';
import ExploreIngredients from '../pages/ExploreIngredients';
import ExploreArea from '../pages/ExploreArea';
import NotFound from '../pages/NotFound';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={ Login } />

      <Route path="/register" exact component={ Register } />

      <Route path="/meals" exact render={ () => <Recipes pageType="meals" /> } />

      <Route
        path="/meals/:id"
        exact
        render={ () => <RecipeDetails pageType="meals" /> }
      />

      <Route
        path="/meals/:id/in-progress"
        render={ () => <RecipeInProgress pageType="meals" /> }
      />

      <Route
        path="/cocktails"
        sensitive
        exact
        render={ () => <Recipes pageType="cocktails" /> }
      />

      <Route
        path="/cocktails/:id"
        exact
        render={ () => <RecipeDetails pageType="cocktails" /> }
      />

      <Route
        path="/cocktails/:id/in-progress"
        exact
        render={ () => <RecipeInProgress pageType="cocktails" /> }
      />

      <Route path="/done-recipes" exact component={ DoneRecipes } />

      <Route path="/profile" exact component={ Profile } />

      <Route path="/favorite-recipes" exact component={ Favorites } />

      <Route path="/explore" exact component={ Explore } />

      <Route
        path="/explore/cocktails"
        exact
        render={ () => <ExploreRecipes pageType="cocktails" /> }
      />

      <Route
        path="/explore/meals"
        exact
        render={ () => <ExploreRecipes pageType="meals" /> }
      />

      <Route
        path="/explore/meals/area"
        exact
        render={ () => <ExploreArea pageType="meals" /> }
      />

      <Route
        path="/explore/meals/ingredients"
        exact
        render={ () => <ExploreIngredients pageType="meals" /> }
      />

      <Route
        path="/explore/cocktails/ingredients"
        exact
        render={ () => <ExploreIngredients pageType="cocktails" /> }
      />

      <Route component={ NotFound } />
    </Switch>
  );
};

export default Routes;
