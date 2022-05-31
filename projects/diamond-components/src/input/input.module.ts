import { NgModule } from '@angular/core'
import { DmndFormFieldModule } from '../form-field'

import { DmndInput } from './input'

@NgModule({
	declarations: [
		DmndInput,
	],
	imports: [
		DmndFormFieldModule,
	],
	exports: [
		DmndInput,
		DmndFormFieldModule,
	],
})
export class DmndInputModule { }
