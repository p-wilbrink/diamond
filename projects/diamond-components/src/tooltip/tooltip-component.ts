import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core'

@Component({
	selector: 'dmnd-tooltip-component',
	exportAs: 'DmndTooltipComponent',
	templateUrl: './tooltip.html',
	styleUrls: [
		'./tooltip.scss',
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class DmndTooltipComponent {

	message: string

	private _closeOnInteraction = false

	private _isVisible = false

	_showTimeoutId: number | undefined

	_hideTimeoutId: number | undefined

	@ViewChild('tooltip', { static: true })
		_tooltip: ElementRef<HTMLElement>

	_showAnimation = 'dmnd-tooltip--show'

	_hideAnimation = 'dmnd-tooltip--hide'

	constructor(
		private _changeDetectorRef: ChangeDetectorRef,
	) { }

	_markForCheck(): void {
		this._changeDetectorRef.markForCheck()
	}

	show(delay?: number) {
		clearTimeout(this._hideTimeoutId)

		this._showTimeoutId = setTimeout(() => {
			this._toggleVisibility(true)
			this._showTimeoutId = undefined
		}, delay)
	}

	hide(delay?: number) {
		clearTimeout(this._showTimeoutId)

		this._hideTimeoutId = setTimeout(() => {
			this._toggleVisibility(false)
			this._hideTimeoutId = undefined
		}, delay)
	}

	_handleBodyInteraction(): void {
		if (this._closeOnInteraction) {
			this.hide(0)
		}
	}

	isVisible(): boolean {
		return this._isVisible
	}

	private _toggleVisibility(isVisible: boolean) {
		const tooltip = this._tooltip.nativeElement
		const showClass = this._showAnimation
		const hideClass = this._hideAnimation
		tooltip.classList.remove(isVisible ? hideClass : showClass)
		tooltip.classList.add(isVisible ? showClass : hideClass)
		this._isVisible = isVisible
	}

}
