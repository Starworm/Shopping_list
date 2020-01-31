import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {RecipeService} from '../recipes/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  userSub: Subscription;
  error: string = null;
  error1: string = null;
  error2: string = null;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private recipeService: RecipeService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(
        user => {
          this.isAuthenticated = user ? true : false;
        }
      );
  }

  onSaveData() {
    if (this.recipeService.getRecipes().length !== 0) {
      this.dataStorageService.storeRecipes();
    } else {
      this.error = 'Recipes list is empty! Add at least one recipe before save.';
      this.error1 = 'or';
      this.error2 = 'click "Manage -> Fetch Data" to fetch recipes from database';
    }
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes()
      .subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onHandleError() {
    this.error = null;
  }
}
