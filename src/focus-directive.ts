import {AfterViewInit, Directive, ElementRef} from '@angular/core';

// http://stackoverflow.com/questions/34502768/why-angular2-template-local-variables-are-not-usable-in-templates-when-using-ng
@Directive({selector: '[focusOnInit]'})
export class FocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    this
      .el
      .nativeElement
      .focus();
  }
}
