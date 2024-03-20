import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private _recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {
  }

  get recipes(): Recipe[] {
    return this._recipes.slice();
  }

  set recipes(value: Recipe[]) {
    this._recipes = value;
    this.recipesChanged.next(this.recipes);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
    alert('Added to shopping list successfully!');
  }

  getRecipe(recipeId: number): Recipe {
    return this.recipes[recipeId];
  }

  addRecipe(recipe: Recipe) {
    this._recipes.push(recipe);
    this.recipesChanged.next(this.recipes);
    alert('Added new recipe!');
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this._recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes);
    alert('Updated recipe!');
  }

  deleteRecipe(index: number) {
    this._recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes);
    alert('Delete recipe successful!');
  }
}
