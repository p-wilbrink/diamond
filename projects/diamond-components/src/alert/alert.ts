import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core'

import { ColorPalette } from '../core/color-palette'

@Component({
	selector: 'dmnd-alert',
	exportAs: 'DmndAlert',
	templateUrl: './alert.html',
	styleUrls: [
		'./alert.scss',
	],
	host: {
		class: 'dmnd-alert',
		'[class.dmnd-color--primary]': 'color === \'primary\'',
		'[class.dmnd-color--secondary]': 'color === \'secondary\'',
		'[class.dmnd-color--accent]': 'color === \'accent\'',
		'[class.dmnd-color--success]': 'color === \'success\'',
		'[class.dmnd-color--info]': 'color === \'info\'',
		'[class.dmnd-color--warning]': 'color === \'warning\'',
		'[class.dmnd-color--error]': 'color === \'error\'',
	},
	encapsulation: ViewEncapsulation.None,
})
export class DmndAlert {

	@Input()
	set color(value: ColorPalette) {
		this._color = value
	}

	get color(): ColorPalette {
		return this._color
	}

	private _color: ColorPalette

	@Input()
	set hasClose(value: BooleanInput) {
		this._hasClose = coerceBooleanProperty(value)
	}

	get hasClose(): BooleanInput {
		return this._hasClose
	}

	private _hasClose = true

	@Input()
	set header(value: string) {
		this._header = value
	}

	get header(): string {
		return this._header
	}

	private _header = ''

	get alert(): HTMLElement {
		return this._alert
	}

	private _alert: HTMLElement

	constructor(
		elementRef: ElementRef<HTMLElement>,
	) {
		this._alert = elementRef.nativeElement
	}

}
