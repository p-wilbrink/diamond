import { Component, ContentChild, ViewEncapsulation } from '@angular/core'
import { DmndCardBody } from './card-body'

@Component({
	selector: 'dmnd-card',
	exportAs: 'DmndCard',
	templateUrl: './card.html',
	styleUrls: [
		'./card.scss',
	],
	host: {
		class: 'dmnd-card',
	},
	encapsulation: ViewEncapsulation.None,
})
export class DmndCard {

	@ContentChild(DmndCardBody)
		_body: DmndCardBody

	ngAfterViewInit(): void {
	}
}
