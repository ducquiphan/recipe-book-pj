import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  storeRecipes(
    // recipes: Recipe[]
  ) {
    const recipes = this.recipeService.recipes;
    this.http.put(environment.API_URL, recipes).subscribe(
      response => {
        console.log(response);
      },
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(environment.API_URL)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.recipes = recipes;
      }),
    );
  }
}
