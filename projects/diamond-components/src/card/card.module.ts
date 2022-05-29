import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'

import { DmndCard } from './card'
import { DmndCardTitle } from './card-title'
import { DmndCardBody } from './card-body'

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DmndCard,
        DmndCardTitle,
        DmndCardBody
    ],
    exports: [
        DmndCard,
        DmndCardTitle,
        DmndCardBody
    ]
})
export class DmndCardModule { }