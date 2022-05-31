import { Component, ViewEncapsulation } from '@angular/core'

@Component({
	selector: 'dmnd-icon',
	exportAs: 'DmndIcon',
	styleUrls: [
		'./icon.scss',
	],
	templateUrl: './icon.html',
	host: {
		class: 'dmnd-icon',
	},
	encapsulation: ViewEncapsulation.None,
})
export class DmndIcon { }
