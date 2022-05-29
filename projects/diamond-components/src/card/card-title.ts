import { Directive } from '@angular/core'

@Directive({
    selector: 'dmnd-card-title',
    exportAs: 'DmndCardTitle',
    host: {
        class: 'dmnd-card__title'
    }
})
export class DmndCardTitle { }