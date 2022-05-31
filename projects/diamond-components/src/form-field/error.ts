import { Directive, InjectionToken, Input } from '@angular/core'

let nextUniqueId = 0

export const DMND_ERROR = new InjectionToken<DmndError>('DmndError')

@Directive({
	selector: 'dmnd-error',
	host: {
		class: 'dmnd-error',
		'[attr.id]': 'id',
	},
	providers: [{
		provide: DMND_ERROR,
		useExisting: DmndError,
	}],
})
export class DmndError {

	@Input()
		id = `dmnd-error-${nextUniqueId++}`

}
