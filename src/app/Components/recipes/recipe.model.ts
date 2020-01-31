import {Ingredient} from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public imageFile: File;
  public ingredients: Ingredient[];

  constructor(name: string, description: string, imageFile: File, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
    this.imageFile = imageFile;
  }

}
