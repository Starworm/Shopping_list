import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService) {
  }

  isLoadedRecipes = false;

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(
      'https://recipes-list-1d3d1.firebaseio.com/recipes.json',
      recipes
    ).subscribe();
  }

  storeImage(image: FormData) {
    return this.http.post(
      'gs://recipes-list-1d3d1.appspot.com/',
      image
    ).subscribe();
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://recipes-list-1d3d1.firebaseio.com/recipes.json',
    )
      .pipe(
        map(
          recipes => {
            // checking if recipe has no ingredients
            return recipes.map(recipe => {
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
          }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}
