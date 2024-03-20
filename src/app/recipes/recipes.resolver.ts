import {ResolveFn} from '@angular/router';
import {Recipe} from "./recipe.model";
import {inject} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";
import {RecipeService} from "./recipe.service";

export const recipesResolver: ResolveFn<Recipe[]> = (route, state) => {
  const dataStorageService = inject(DataStorageService);
  const recipeService = inject(RecipeService);
  const recipes = recipeService.recipes;
  if (recipes.length === 0) {
    return dataStorageService.fetchRecipes();
  } else {
    return recipes;
  }
};

