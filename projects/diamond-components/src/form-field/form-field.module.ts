import { NgModule } from '@angular/core'

import { CommonModule } from '@angular/common'

import { DmndFormField } from './form-field'
import { DmndHint } from './hint'
import { DmndError } from './error'
import { DmndLabel } from './label'

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DmndFormField,
        DmndHint,
        DmndError,
        DmndLabel
    ],
    exports: [
        DmndFormField,
        DmndHint,
        DmndError,
        DmndLabel
    ]
})
export class DmndFormFieldModule { }
