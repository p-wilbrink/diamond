import { Component, Input, ViewEncapsulation } from '@angular/core'

import { ColorPalette } from '../core/color-palette'

@Component({
	selector: 'dmnd-toolbar',
	exportAs: 'DmndToolbar',
	templateUrl: './toolbar.html',
	styleUrls: [
		'./toolbar.scss',
	],
	host: {
		class: 'dmnd-toolbar',
		'[class.dmnd-color--primary]': 'color === \'primary\'',
		'[class.dmnd-color--secondary]': 'color === \'secondary\'',
	},
	encapsulation: ViewEncapsulation.None,
})
export class DmndToolbar {

	@Input()
	set color(value: ColorPalette) {
		this._color = value
	}

	get color(): ColorPalette {
		return this._color
	}

	private _color: ColorPalette

}
