import {AfterViewInit, Directive, ElementRef, Input,} from '@angular/core';

@Directive({
  selector: 'input[egFocus]',
})
export class EgFocusDirective implements AfterViewInit {

  @Input('egFocus')
  private focused: boolean = false;

  constructor(public element: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {
    // ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    if (this.focused) {
      setTimeout(() => this.element.nativeElement.focus(), 0);
    }
  }
}
