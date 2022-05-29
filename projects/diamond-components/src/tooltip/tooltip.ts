import { AfterViewInit, Directive, ElementRef, Inject, Input, NgZone, OnDestroy, ViewContainerRef } from '@angular/core'

import { ConnectedPosition, ConnectionPositionPair, FlexibleConnectedPositionStrategy, HorizontalConnectionPos, OriginConnectionPosition, Overlay, OverlayConnectionPosition, OverlayRef, ScrollStrategy, VerticalConnectionPos } from '@angular/cdk/overlay'
import { ScrollDispatcher } from '@angular/cdk/scrolling'
import { FocusMonitor } from '@angular/cdk/a11y'
import { Subject, take, takeUntil } from 'rxjs'
import { DmndTooltipComponent } from './tooltip-component'
import { ComponentPortal } from '@angular/cdk/portal'
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform'
import { DOCUMENT } from '@angular/common'
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes'

export type TooltipPosition = 'below' | 'above' | 'left' | 'right'

const passiveListenerOptions = normalizePassiveListenerOptions({passive: true})

@Directive({
    selector: '[dmnd-tooltip]',
    exportAs: 'DmndTooltip'
})
export class DmndTooltip implements AfterViewInit, OnDestroy {

    private _portal: ComponentPortal<DmndTooltipComponent>

    _overlayRef: OverlayRef | null

    _tooltipInstance: DmndTooltipComponent | null

    private _currentPosition: TooltipPosition

    @Input('dmnd-tooltip')
    set message(value: string) {
        this._message = value != null ? String(value).trim() : ''

        if (!this._message && this._isTooltipVisible()) {
            this.hide(0)
        } else {
            this._setupPointerEnterEventsIfNeeded()
            this._updateTooltipMessage()
        }
    }

    get message(): string {
        return this._message
    }

    private _message: string

    @Input('dmnd-tooltip-position')
    set position(value: TooltipPosition) {
        this._position = value
    }

    get position(): TooltipPosition {
        return this._position
    }

    private _position: TooltipPosition = 'below'

    private readonly _destroyed: Subject<void> = new Subject<void>()

    private readonly _passiveListeners: (readonly [string, EventListenerOrEventListenerObject])[] = []

    private _viewInitialized: boolean = false

    private _pointerExitEventsInitialized: boolean = false

    constructor(
        private _overlay: Overlay,
        private _elementRef: ElementRef<HTMLElement>,
        private _scrollDispatcher: ScrollDispatcher,
        private _viewContainerRef: ViewContainerRef,
        private _ngZone: NgZone,
        private _focusMonitor: FocusMonitor,
        private _platform: Platform,
        @Inject(DOCUMENT) private _document: Document
    ) { 
    }

    ngAfterViewInit(): void {
        this._viewInitialized = true

        this._setupPointerEnterEventsIfNeeded()

        this._focusMonitor
            .monitor(this._elementRef)
            .pipe(
                takeUntil(
                    this._destroyed
                )
            )
            .subscribe((origin) => {
                if (!origin) {
                    this._ngZone.run(() => this.hide(0))
                } else if (origin === 'keyboard') {
                    this._ngZone.run(() => this.show())
                }
            })
    }

    ngOnDestroy(): void {
        const nativeElement = this._elementRef.nativeElement
        
        if (this._overlayRef) {
            this._overlayRef.dispose()
            this._tooltipInstance = null
        }

        this._passiveListeners.forEach(([event, listener]) => {
            nativeElement.removeEventListener(event, listener)
        })

        this._passiveListeners.length = 0

        this._destroyed.next()
        this._destroyed.complete()
        this._focusMonitor.stopMonitoring(nativeElement)
    }

    show(delay?: number) {
        if (
            !this.message ||
            (
                this._isTooltipVisible()
            )
        ) {
            return
        }

        const overlayRef = this._createOverlay()

        this._detach()

        this._portal = this._portal || new ComponentPortal(DmndTooltipComponent, this._viewContainerRef)

        const instance = (this._tooltipInstance = overlayRef.attach(this._portal).instance)

       // instance._triggerElement = this._elementRef.nativeElement;
       // instance._mouseLeaveHideDelay = this._hideDelay;
       // instance
         // .afterHidden()
         // .pipe(takeUntil(this._destroyed))
         // .subscribe(() => this._detach());
        this._updateTooltipMessage()
        instance.show(delay)
    }

    hide(delay?: number) {
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay)
        }
    }

    toggle() {
        this._isTooltipVisible() ? this.hide() : this.show()
    }

    _isTooltipVisible(): boolean {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible()
    }

    private _updateTooltipMessage() {
        console.log('updating message')
        if (this._tooltipInstance) {
            console.log('has instance')
            this._tooltipInstance.message = this.message
            this._tooltipInstance._markForCheck()

            this._ngZone.onMicrotaskEmpty.pipe(
                take(1),
                takeUntil(this._destroyed)
            ).subscribe(() => {
                if (this._tooltipInstance) {
                    this._overlayRef!.updatePosition()
                }
            })
        }
    }

    private _createOverlay(): OverlayRef {
        if (this._overlayRef) {
            return this._overlayRef
        }

        const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(
            this._elementRef
        )

        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withTransformOriginOn(`.dmnd-tooltip`)
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withScrollableContainers(scrollableAncestors)

        strategy.positionChanges
            .pipe(
                takeUntil(
                    this._destroyed
                )
            ).subscribe((change) => {
                this._updateCurrentPositionClass(change.connectionPair)

                if (this._tooltipInstance) {
                    if (change.scrollableViewProperties.isOriginClipped && this._tooltipInstance.isVisible()) {
                        this._ngZone.run(() => this.hide(0))
                    }
                }
            })

        this._overlayRef = this._overlay.create({
            direction: 'ltr',
            positionStrategy: strategy,
            scrollStrategy: this._overlay.scrollStrategies.close()
        })

        this._updatePosition(this._overlayRef)

        this._overlayRef
            .detachments()
            .pipe(
                takeUntil(
                    this._destroyed
                )
            ).subscribe(() => this._detach())

        this._overlayRef
            .outsidePointerEvents()
            .pipe(
                takeUntil(
                    this._destroyed
                )
            ).subscribe(() => {
                this._tooltipInstance?._handleBodyInteraction()
            })

        this._overlayRef
            .keydownEvents()
            .pipe(
                takeUntil(
                    this._destroyed
                )
            )
            .subscribe((event) => {
                if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
                    event.preventDefault()
                    event.stopPropagation()
                    this._ngZone.run(() => this.hide(0))
                }
            })
        return this._overlayRef
    }

    private _detach() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach()
        }

        this._tooltipInstance = null
    }

    private _updatePosition(overlayRef: OverlayRef) {
        const position = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy
        const origin = this._getOrigin()
        const overlay = this._getOverlayPosition()

        position.withPositions([
            this._addOffset({
                ...origin.main,
                ...overlay.main
            }),
            this._addOffset({
                ...origin.fallback,
                ...overlay.fallback
            })
        ])
    }

    protected _addOffset(position: ConnectedPosition): ConnectedPosition {
        return position
    }

    _getOrigin(): { main: OriginConnectionPosition, fallback: OriginConnectionPosition } {
        const position = this.position

        let originPosition: OriginConnectionPosition

        if (position === 'above' || position === 'below') {
            originPosition = {
                originX: 'center',
                originY: position === 'above' ? 'top' : 'bottom'
            }
        } else if (
            position === 'left'
        ) {
            originPosition = {
                originX: 'start',
                originY: 'center'
            }
        } else {
            originPosition = {
                originX: 'end',
                originY: 'center'
            }
        }

        const { x, y } = this._invertPosition(originPosition!.originX, originPosition!.originY)

        return {
            main: originPosition!,
            fallback: {
                originX: x,
                originY: y
            }
        }
    }

    _getOverlayPosition(): { main: OverlayConnectionPosition, fallback: OverlayConnectionPosition } {
        const position = this.position
        let overlayPosition: OverlayConnectionPosition

        if (position === 'above') {
            overlayPosition = {
                overlayX: 'center',
                overlayY: 'bottom'
            }
        } else if (position === 'below') {
            overlayPosition = {
                overlayX: 'center',
                overlayY: 'top'
            }
        } else if (position === 'left') {
            overlayPosition = {
                overlayX: 'end',
                overlayY: 'center'
            }
        } else {
            overlayPosition = {
                overlayX: 'start',
                overlayY: 'center'
            }
        }

        const { x, y } = this._invertPosition(overlayPosition!.overlayX, overlayPosition!.overlayY)

        return {
            main: overlayPosition!,
            fallback: {
                overlayX: x,
                overlayY: y
            }
        }
    }

    private _invertPosition(x: HorizontalConnectionPos, y: VerticalConnectionPos) {
        if (this.position === 'above' || this.position === 'below') {
            if (y === 'top') {
                y = 'bottom'
            } else if (y === 'bottom') {
                y = 'top'
            }
        } else {
            if (x === 'end') {
                x = 'start'
            } else if (x === 'start') {
                x = 'end'
            }
        }

        return { x, y }
    }

    private _updateCurrentPositionClass(connectionPair: ConnectionPositionPair): void {
        const { overlayY, originX, originY } = connectionPair
        let newPosition: TooltipPosition;

        if (overlayY === 'center') {
            newPosition = originX === 'start' ? 'left' : 'right'
        } else {
            newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below'
        }

        if (newPosition !== this._currentPosition) {
            const overlayRef = this._overlayRef

            if (overlayRef) {
            //   const classPrefix = `${this._cssClassPrefix}-${PANEL_CLASS}-`;
        //   overlayRef.removePanelClass(classPrefix + this._currentPosition);
        //  overlayRef.addPanelClass(classPrefix + newPosition);
            }

            this._currentPosition = newPosition
        }
    }

    private _setupPointerEnterEventsIfNeeded() {
        if (
            !this.message ||
            !this._viewInitialized ||
            this._passiveListeners.length
        ) {
            return
        }
    
        if (this._platformSupportsMouseEvents()) {
            this._passiveListeners.push([
                'mouseenter',
                () => {
                    this._setupPointerExitEventsIfNeeded()
                    this.show();
                },
            ])
        }

        this._addListeners(this._passiveListeners)
    }

    private _setupPointerExitEventsIfNeeded() {
        if (this._pointerExitEventsInitialized) {
            return
        }
        this._pointerExitEventsInitialized = true
    
        const exitListeners: (readonly [string, EventListenerOrEventListenerObject])[] = []

        if (this._platformSupportsMouseEvents()) {
            exitListeners.push(
                [
                    'mouseleave',
                    event => {
                        const newTarget = (event as MouseEvent).relatedTarget as Node | null
                        if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
                            this.hide()
                        }
                    },
                ],
                ['wheel', event => this._wheelListener(event as WheelEvent)],
            )
        }
    
        this._addListeners(exitListeners)
        this._passiveListeners.push(...exitListeners)
    }

    private _addListeners(listeners: (readonly [string, EventListenerOrEventListenerObject])[]) {
        listeners.forEach(([event, listener]) => {
            this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions)
        })
    }

    private _platformSupportsMouseEvents() {
        return !this._platform.IOS && !this._platform.ANDROID
    }

    private _wheelListener(event: WheelEvent) {
        if (this._isTooltipVisible()) {
            const elementUnderPointer = this._document.elementFromPoint(event.clientX, event.clientY)
            const element = this._elementRef.nativeElement
    
            if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
                this.hide()
            }
        }
    }
    
}