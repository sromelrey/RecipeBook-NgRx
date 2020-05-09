import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    // const recipes = this.recipeService.getRecipes();
    // this.http
    //   .put("https://ng-recipe-book-a0057.firebaseio.com/recipe.json", recipes)
    //   .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>("https://ng-recipe-book-a0057.firebaseio.com/recipe.json")
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) =>
          // this.recipeService.setRecipes(recipes)
          this.store.dispatch(new RecipesActions.SetRecipes(recipes))
        )
      );
  }
}
