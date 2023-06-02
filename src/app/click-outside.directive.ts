import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private el: ElementRef) { }
  @Output() clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
	  if (!targetElement) {
		  return;
	  }
	  const clickedInside = this.el.nativeElement.contains(targetElement);
	  if( this.el.nativeElement.id !== 'navbar-toggler' && !clickedInside) {
		  this.clickOutside.emit(event);
	  }
  }
}
