import {NgModule} from '@angular/core';
import {AlertComponent} from './alert/alert.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {PlaceholderDirective} from './placeholder/placeholder.directive';
import {DropdownDirective} from './dropdown.directive';
import {CommonModule} from '@angular/common';
import {DeleteAlertComponent} from './delete-alert/delete-alert.component';

@NgModule({
  declarations: [
    AlertComponent,
    DeleteAlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
    DeleteAlertComponent
  ],
  entryComponents: [
    AlertComponent,
    DeleteAlertComponent
  ]
})
export class SharedModule {

}
