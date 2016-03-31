import {Component, Directive, ElementRef} from 'angular2/core';


// http://stackoverflow.com/questions/34502768/why-angular2-template-local-variables-are-not-usable-in-templates-when-using-ng
@Directive({
  selector: '[focusOnInit]'
})
export class FocusDirective {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}
