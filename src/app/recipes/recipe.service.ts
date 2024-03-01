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

  private _recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe 1',
      'This is simply a test',
      'https://www.shutterstock.com/image-photo/notepad-your-recipe-herbs-spices-260nw-370298699.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
      ]),
    new Recipe(
      'Big Fat Burger',
      'OMG - It is big fat tasty',
      'https://www.shutterstock.com/image-photo/notepad-your-recipe-herbs-spices-260nw-370298699.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
      ]),
  ];

  constructor(private shoppingListService: ShoppingListService) {
  }

  get recipes(): Recipe[] {
    return this._recipes.slice();
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
