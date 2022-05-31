import { NgModule } from '@angular/core'

import { OverlayModule } from '@angular/cdk/overlay'

import { DmndTooltip } from './tooltip'
import { DmndTooltipComponent } from './tooltip-component'
import { A11yModule } from '@angular/cdk/a11y'
import { CdkScrollableModule } from '@angular/cdk/scrolling'

@NgModule({
	imports: [
		OverlayModule,
		A11yModule,
	],
	declarations: [
		DmndTooltip,
		DmndTooltipComponent,
	],
	exports: [
		OverlayModule,
		DmndTooltip,
		DmndTooltipComponent,
		CdkScrollableModule,
	],
})
export class DmndTooltipModule { }
