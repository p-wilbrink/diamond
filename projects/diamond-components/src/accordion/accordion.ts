import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { Component, ContentChild, EventEmitter, InjectionToken, Input, Output, ViewEncapsulation } from '@angular/core'
import { ColorPalette } from '../core/color-palette'

import { DmndAccordionBody } from './accordion-body'
import { DmndAccordionTitle } from './accordion-title'

export const DMND_ACCORDION = new InjectionToken<DmndAccordion>('DmndAccordion')

@Component({
    selector: 'dmnd-accordion',
    exportAs: 'DmndAccordion',
    templateUrl: './accordion.html',
    styleUrls: [
        './accordion.scss'
    ],
    host: {
        class: 'dmnd-accordion',
        '[class.dmnd-accordion--open]': 'opened',
        '[class.dmnd-accordion--closed]': '!opened',
        '[class.dmnd-color--primary]': `color === 'primary'`,
        '[class.dmnd-color--secondary]': `color === 'secondary'`,
        '[class.dmnd-color--accent]': `color === 'accent'`,
        '[class.dmnd-color--success]': `color === 'success'`,
        '[class.dmnd-color--info]': `color === 'info'`,
        '[class.dmnd-color--warning]': `color === 'warning'`,
        '[class.dmnd-color--error]': `color === 'error'`
    },
    encapsulation: ViewEncapsulation.None,
    providers: [{provide: DMND_ACCORDION, useExisting: DmndAccordion}]
})
export class DmndAccordion { 

    @ContentChild(DmndAccordionTitle)
    title: DmndAccordionTitle 

    @ContentChild(DmndAccordionBody)
    body: DmndAccordionBody

    @Input()
    set opened(value: BooleanInput) {
        this._opened = coerceBooleanProperty(value)
    }

    get opened(): boolean {
        return this._opened
    }

    private _opened: boolean = false

    @Input()
    set color(value: ColorPalette) {
        this._color = value
    }

    get color(): ColorPalette {
        return this._color
    }

    private _color: ColorPalette

    @Output()
    onOpen: EventEmitter<void> = new EventEmitter<void>()

    @Output()
    onClose: EventEmitter<void> = new EventEmitter<void>()

    open() {
        this.opened = true
        this.onOpen.emit()
    }

    close() {
        this.opened = false
        this.onClose.emit()
    }

    toggle() {
        this._opened ? this.close() : this.open()
    }

}