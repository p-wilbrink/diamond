import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core'

@Directive({
    selector: '[dmnd-closeable]',
    exportAs: 'DmndCloseable'
})
export class DmndCloseable {

    @Input()
    set closes(value: HTMLElement) {
        this._closes = value
    }

    get closes(): HTMLElement {
        return this._closes
    }

    private _closes: HTMLElement

    @Output()
    onClose: EventEmitter<void> = new EventEmitter<void>()

    @HostListener('click')
    protected onClick() {
        this.closes.remove()
        this.onClose.emit()
    }
}