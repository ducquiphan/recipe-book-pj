import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes.component";
import {authCanActivateGuard} from "../auth/auth.can-activate.guard";
import {RecipeStartComponent} from "./recipe-start/recipe-start.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";
import {recipesResolver} from "./recipes.resolver";

const routes: Routes = [{
  path: '', component: RecipesComponent, canActivate: [authCanActivateGuard], children: [
    {path: '', component: RecipeStartComponent},
    {path: 'new', component: RecipeEditComponent},
    {path: ':id', component: RecipeDetailComponent, resolve: [recipesResolver]},
    {path: ':id/edit', component: RecipeEditComponent, resolve: [recipesResolver]},
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RecipesRoutingModule {
}
