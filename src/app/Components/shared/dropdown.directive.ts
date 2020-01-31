import {Directive, ElementRef, HostBinding, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appDrowdown]'
})
export class DropdownDirective implements OnInit {

  @HostBinding('class.open') isOpen = false;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {

  }

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.element.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

}
