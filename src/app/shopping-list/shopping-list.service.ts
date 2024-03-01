import {Injectable} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private _ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  constructor() {
  }

  get ingredients(): Ingredient[] {
    return this._ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    console.log(this.ingredients);
    this.ingredientsChanged.next(this.ingredients);
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this._ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients);
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this._ingredients[index] = newIngredient;
    alert('Update ingredient successful!');
    this.ingredientsChanged.next(this.ingredients);
  }

  deleteIngredient(index: number) {
    this._ingredients.splice(index, 1);
    alert('Delete ingredient successful!');
    this.ingredientsChanged.next(this.ingredients);
  }
}
