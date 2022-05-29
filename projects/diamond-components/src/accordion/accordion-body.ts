import { Component, ViewEncapsulation } from '@angular/core'

@Component({
    selector: 'dmnd-accordion-body',
    exportAs: 'DmndAccordionBody',
    template: '<ng-content></ng-content>',
    styleUrls: [
        './accordion.scss'
    ],
    host: {
        class: 'dmnd-accordion__body'
    },
    encapsulation: ViewEncapsulation.None
})
export class DmndAccordionBody { 
    
}