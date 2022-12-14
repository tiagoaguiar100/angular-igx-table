import { Directive, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { IgxGridRow } from 'igniteui-angular';

import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[contextMenu]',
})
export class ContextMenuDirective {
  @Input() contextMenu: TemplateRef<any>;
  @Input() row: IgxGridRow;

  private _overlayRef: OverlayRef | null;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private contextMenuService: ContextMenuService
  ) {}

  /**
   * Listener for the 'contextmenu' event.
   * @param event
   */
   @HostListener('contextmenu', ['$event'])
   onInput(event: any) {
     event.preventDefault();

    const config = new OverlayConfig();
    config.hasBackdrop = true;
    config.backdropClass = 'cdk-overlay-transparent-backdrop';
    config.positionStrategy = this.overlay.position().flexibleConnectedTo({x: event.clientX, y: event.clientY}).withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    }]);

    this._overlayRef = this.overlay.create(config);

    this._overlayRef.attach(new TemplatePortal(this.contextMenu, this.viewContainerRef, {
      $implicit: this.row
    }));

    this._overlayRef.backdropClick().subscribe(() => this._overlayRef?.dispose());

    this.contextMenuService.setContextMenu(this._overlayRef);
   }
}
