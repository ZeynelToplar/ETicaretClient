import { ViewContainerRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[appDynamicLoadComponent]'
})
export class DynamicLoadComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
