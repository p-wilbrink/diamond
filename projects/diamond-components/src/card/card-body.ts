import { Directive } from '@angular/core'

@Directive({
    selector: 'dmnd-card-body',
    exportAs: 'DmndCardBody',
    host: {
        class: 'dmnd-card__body'
    }
})
export class DmndCardBody { }