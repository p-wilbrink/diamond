import { NgModule } from '@angular/core'

import { DmndAccordion } from './accordion'
import { DmndAccordionBody } from './accordion-body'
import { DmndAccordionTitle } from './accordion-title'

@NgModule({
    declarations: [
        DmndAccordion,
        DmndAccordionTitle,
        DmndAccordionBody
    ],
    exports: [
        DmndAccordion,
        DmndAccordionTitle,
        DmndAccordionBody
    ]
})
export class DmndAccordionModule { }