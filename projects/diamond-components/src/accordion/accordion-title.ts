import { Component, HostListener, Inject, ViewEncapsulation } from '@angular/core'
import { DmndAccordion, DMND_ACCORDION } from './accordion';

@Component({
    selector: 'dmnd-accordion-title',
    exportAs: 'DmndAccordionTitle',
    templateUrl: './accordion-title.html',
    styleUrls: [
        './accordion.scss'
    ],
    host: {
        class: 'dmnd-accordion__title'
    },
    encapsulation: ViewEncapsulation.None
})
export class DmndAccordionTitle { 
    
    constructor(
        @Inject(DMND_ACCORDION) private _accordion?: DmndAccordion,
    ) { }

    @HostListener('click')
    onClick() {
        this._accordion?.toggle()
    }
}