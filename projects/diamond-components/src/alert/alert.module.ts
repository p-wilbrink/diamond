import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { DmndCloseableModule } from '../closeable'
import { DmndIconModule } from '../icon'

import { DmndAlert } from './alert'

@NgModule({
    imports: [
        DmndCloseableModule,
        DmndIconModule,
        CommonModule
    ],
    declarations: [
        DmndAlert
    ],
    exports: [
        DmndAlert,
        DmndCloseableModule,
        DmndIconModule
    ]
})
export class DmndAlertModule { }