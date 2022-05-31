import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	ElementRef,
	InjectionToken,
	Input,
	OnDestroy,
	QueryList,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core'

import { AbstractControlDirective } from '@angular/forms'

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'

import { startWith, Subject, takeUntil } from 'rxjs'

import { DmndError, DMND_ERROR } from './error'
import { DmndFormFieldControl } from './form-field.control'
import { DmndHint, DMND_HINT } from './hint'

export const DMND_FORM_FIELD = new InjectionToken<DmndFormField>('DmndFormField')

let nextUniqueId = 0

@Component({
	selector: 'dmnd-form-field',
	exportAs: 'DmndFormField',
	templateUrl: './form-field.html',
	styleUrls: [
		'./form-field.scss',
	],
	host: {
		class: 'dmnd-form-field',
		'[class.dmnd-form-field--invalid]': '_control.errorState',
		'[class.dmnd-form-field--disabled]': '_control.disabled',
		'[class.dmnd-focused]': '_control.focused',
		'[class.ng-untouched]': '_shouldForward("untouched")',
		'[class.ng-touched]': '_shouldForward("touched")',
		'[class.ng-pristine]': '_shouldForward("pristine")',
		'[class.ng-dirty]': '_shouldForward("dirty")',
		'[class.ng-valid]': '_shouldForward("valid")',
		'[class.ng-invalid]': '_shouldForward("invalid")',
		'[class.ng-pending]': '_shouldForward("pending")',
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DMND_FORM_FIELD,
			useExisting: DmndFormField,
		},
	],
})
export class DmndFormField implements AfterContentInit, OnDestroy {

	@ViewChild('inputContainer')
		_inputContainerRef: ElementRef<HTMLElement>

	@ViewChild('label')
		label: ElementRef<HTMLElement>

	@ContentChild(DmndFormFieldControl)
		_controlNonStatic: DmndFormFieldControl<any>

	@ContentChild(DmndFormField, { static: true })
		_controlStatic: DmndFormFieldControl<any>

	set _control(value: DmndFormFieldControl<any>) {
		this._explicitFormFieldControl = value
	}

	get _control() {
		return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic
	}

	private _explicitFormFieldControl: DmndFormFieldControl<any>

	@ContentChildren(DMND_ERROR, { descendants: true })
		_errorChildren: QueryList<DmndError>

	@ContentChildren(DMND_HINT, { descendants: true })
		_hintChildren: QueryList<DmndHint>

	@Input()
	set hideRequiredMarker(value: BooleanInput) {
		this._hideRequiredMarker = coerceBooleanProperty(value)
	}

	get hideRequiredMarker(): boolean {
		return this._hideRequiredMarker
	}

	private _hideRequiredMarker = false

	readonly _labelId = `dmnd-form-field__label-${nextUniqueId++}`

	private readonly _destroyed: Subject<void> = new Subject<void>()

	constructor(
		private _elementRef: ElementRef,
		private _changeDetectorRef: ChangeDetectorRef,
	) {

	}

	ngAfterContentInit(): void {
		const control = this._control

		control.stateChanges
			.pipe(
				startWith(null),
			).subscribe(() => {
				this._changeDetectorRef.markForCheck()
			})

		if (control.ngControl && control.ngControl.valueChanges) {
			control.ngControl.valueChanges
				.pipe(
					takeUntil(
						this._destroyed,
					),
				).subscribe(() => this._changeDetectorRef.markForCheck())
		}

		this._hintChildren.changes
			.pipe(
				startWith(null),
			).subscribe(() => {
				this._changeDetectorRef.markForCheck()
			})

		this._errorChildren.changes
			.pipe(
				startWith(null),
			).subscribe(() => {
				this._changeDetectorRef.markForCheck()
			})

	}

	ngOnDestroy() {
		this._destroyed.next()
		this._destroyed.complete()
	}

	_getDisplayedMessages(): 'error' | 'hint' {
		return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState
			? 'error'
			: 'hint'
	}

	_shouldForward(prop: keyof AbstractControlDirective): boolean {
		const control = this._control ? this._control.ngControl : null
		return control && control[prop]
	}
}
