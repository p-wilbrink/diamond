import { Component, Input, ViewEncapsulation } from '@angular/core'

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { ColorPalette } from '../core/color-palette'

type ButtonAppearance = 'default' | 'outline' | 'rounded'

@Component({
    selector: 'a[dmnd-button], button[dmnd-button]',
    exportAs: 'DmndButton',
    templateUrl: './button.html',
    styleUrls: [
        './button.scss'
    ],
    host: {
        class: 'dmnd-button',
        '[class.dmnd-color--primary]': `color === 'primary'`,
        '[class.dmnd-color--secondary]': `color === 'secondary'`,
        '[class.dmnd-color--accent]': `color === 'accent'`,
        '[class.dmnd-button--disabled]': 'disabled',
        '[attr.disabled]': 'disabled || null',
        '[class.dmnd-button--appearance-default]': `appearance === 'default'`,
        '[class.dmnd-button--appearance-outline]': `appearance === 'outline'`,
        '[class.dmnd-button--appearance-rounded]': `appearance === 'rounded'`,
        '[attr.id]': 'id'
    },
    encapsulation: ViewEncapsulation.None
})
export class DmndButton { 

    /**
     * Sets the disabled state of the button
     * @param value BooleanInput
     */
    @Input()
    set disabled(value: BooleanInput) {
        this._disabled = coerceBooleanProperty(value)
    }

    get disabled(): boolean {
        return this._disabled
    }

    /**
     * @ignore
     */
    private _disabled: boolean = false

    /**
     * Color of the button
     */
    @Input()
    set color(value: ColorPalette) {
        this._color = value
    }

    get color(): ColorPalette {
        return this._color
    }

    /**
     * @ignore
     */
    private _color: ColorPalette = 'primary'

    /**
     * Id of the button
     */
    @Input()
    set id(value: string) {
        this._id = value
    }

    get id(): string {
        return this._id
    }

    private _id: string

    
    /**
     * Appearance of the button, defaults to 'default'
     */
    @Input()
    set appearance(value: ButtonAppearance) {
        this._appearance = value
    }

    get appearance(): ButtonAppearance {
        return this._appearance
    }

    private _appearance: ButtonAppearance = 'default'

}