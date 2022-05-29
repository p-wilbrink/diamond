import { NgModule } from '@angular/core'

import { DmndCloseable } from './closeable'

@NgModule({
    declarations: [
        DmndCloseable
    ],
    exports: [
        DmndCloseable
    ]
})
export class DmndCloseableModule { }