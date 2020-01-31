// A directive for programmatically controlled dynamic components
import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPlaceHolder]'
})
export class PlaceholderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {

  }
}
