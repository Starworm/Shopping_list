import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {DataStorageService} from '../../shared/data-storage.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;             // number of recipe
  editMode = false;
  recipeForm: FormGroup;
  selectedFile: File = null;

  firebaseConfig = {
    apiKey: 'AIzaSyBJq4rKYMtw4yoJedZwElC79PCGJ6M-foQ',
    authDomain: 'https://recipes-list-1d3d1.firebaseapp.com/',
    databaseURL: 'https://recipes-list-1d3d1.firebaseio.com/',
    storageBucket: 'gs://recipes-list-1d3d1.appspot.com/'
  };

  stor = 'gs://recipes-list-1d3d1.appspot.com/';
  firebaseClient = firebase.initializeApp(this.firebaseConfig);
  storageRef = this.firebaseClient.storage().ref();

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private dataStorageService: DataStorageService) {
  }

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.editMode = params.id != null;
          this.initForm();
        }
      );

  }

  private initForm() {

    let recipeName = '';
    let recipeImagePath = '';
    let recipeImageFile = null;
    // let storage = this.firebaseClient.storage().ref();
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;
      recipeImageFile = recipe.imageFile;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required, Validators.pattern('^[1-9]+[0-9]*$')
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      imageFile: new FormControl(recipeImageFile, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
    // recipeImageFile = this.selectedFile;
  }

  onSubmit() {
    // Can be replaced by simply this.recipeForm.value

    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    //   );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.dataStorageService.storeRecipes();
      this.firebaseClient.storage().ref('gs://recipes-list-1d3d1.appspot.com/').put(this.selectedFile).then((snapshot) => {
        console.log('Uploaded!');
      });

    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
      // this.firebaseClient.storage(this.stor).ref().put(this.selectedFile)
      //   .then(() => {
      //     console.log('Done');
      //   });
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.dataStorageService.storeImage(fd);
      this.dataStorageService.storeRecipes();

    }
    this.onCancel();
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required, Validators.pattern('^[1-9]+[0-9]*$')
        ])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
    console.log(this.selectedFile);
  }
}
