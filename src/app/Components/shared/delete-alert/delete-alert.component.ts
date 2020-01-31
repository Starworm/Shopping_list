import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecipeService} from '../../recipes/recipe.service';
import {Router} from '@angular/router';
import {DataStorageService} from '../data-storage.service';
import {RecipeDetailComponent} from '../../recipes/recipe-detail/recipe-detail.component';

@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.css']
})
export class DeleteAlertComponent {

  @Input() message: string;
  @Output() closeAlert = new EventEmitter<void>();

  constructor(private recipeService: RecipeService,
              private router: Router,
              private dataStorageService: DataStorageService,
              private recipe: RecipeDetailComponent) { }

  delete() {
    const id = this.recipe.id;
    this.recipeService.deleteRecipe(id);
    this.router.navigate(['/recipes']);
    this.dataStorageService.storeRecipes();
    this.closeAlert.emit();
  }

  cancel() {
    this.closeAlert.emit();
  }
}
