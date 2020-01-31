import {Component, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {


  constructor(private dataStorageService: DataStorageService) {

  }

  ngOnInit() {
    if (this.dataStorageService.isLoadedRecipes === false) {
      this.dataStorageService.isLoadedRecipes = true;
      this.dataStorageService.fetchRecipes()
        .subscribe();
    }
  }

}
