import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { getSupportedInputTypes } from '@angular/cdk/platform'
import { Directive, DoCheck, ElementRef, Inject, InjectionToken, Input, Optional, Self } from '@angular/core'
import { AbstractControl, FormGroupDirective, NgControl, NgForm, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { ErrorStateMatcher } from '../core/error-state.matcher'

import { DmndFormFieldControl } from '../form-field/form-field.control'

let nextUniqueId = 0

const DMND_INPUT_VALUE_ACCESSOR = new InjectionToken<{ value: any }>('DMND_INPUT_VALUE_ACCESSOR')

@Directive({
	selector: 'input[dmnd-input], select[dmnd-input]',
	exportAs: 'DmndInput',
	host: {
		class: 'dmnd-input',
		'[attr.id]': 'id',
		'[disabled]': 'disabled',
		'[required]': 'required',
		'[placeholder]': 'placeholder',
		'[attr.name]': 'name || null',
		'[attr.readonly]': 'readonly || null',
		'(focus)': '_focusChanged(true)',
		'(blur)': '_focusChanged(false)',
		'(input)': '_onInput()',
	},
	providers: [
		{
			provide: DmndFormFieldControl,
			useExisting: DmndInput,
		},
	],
})
export class DmndInput implements DmndFormFieldControl<string>, DoCheck {

	protected _uid = `dmnd-input-${nextUniqueId++}`

	focused = false

	readonly stateChanges: Subject<void> = new Subject<void>()

	@Input()
	set disabled(value: BooleanInput) {
		this._disabled = coerceBooleanProperty(value)

		if (this.focused) {
			this.focused = false
			this.stateChanges.next()
		}
	}

	get disabled(): boolean {
		if (this.ngControl && this.ngControl.disabled !== null) {
			return this.ngControl.disabled
		}
		return this._disabled
	}

	private _disabled = false

	@Input()
	set id(value: string) {
		this._id = value || this._uid
	}

	get id(): string {
		return this._id
	}

	private _id: string

	@Input()
		placeholder: string

	@Input()
	set required(value: BooleanInput) {
		this._required = coerceBooleanProperty(value)
	}

	get required(): boolean {
		return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false
	}

	private _required: boolean | undefined

	@Input()
	set value(value: any) {
		if (value !== this.value) {
			this._inputValueAccessor.value = value
			this.stateChanges.next()
		}
	}

	get value(): string {
		return this._inputValueAccessor.value
	}

	@Input()
	set readonly(value: BooleanInput) {
		this._readonly = coerceBooleanProperty(value)
	}

	get readonly(): boolean {
		return this._readonly
	}

	private _readonly = false

	@Input()
	get type(): string {
		return this._type
	}

	set type(value: string) {
		this._type = value || 'text'
		if (!this._isTextArea && getSupportedInputTypes().has(this._type)) {
			(this._elementRef.nativeElement as HTMLInputElement).type = this._type
		}
	}

	protected _type = 'text'

	get empty(): boolean {
		return (
			!this._isNeverEmpty()
			&& !this._elementRef.nativeElement.value
			&& !this._isBadInput()
		)
	}

	private _isNeverEmpty(): boolean {
		return [
			'date',
			'datetime',
			'datetime-local',
			'month',
			'time',
			'week',
		].filter((t) => getSupportedInputTypes().has(t)).indexOf(this._type) > -1
	}

	private _isBadInput(): boolean {
		const { validity } = this._elementRef.nativeElement as HTMLInputElement
		return validity && validity.badInput
	}

	private _inputValueAccessor: { value: string }

	private _isTextArea: boolean

	public errorState: boolean

	@Input()
	private errorStateMatcher: ErrorStateMatcher

	constructor(
		private _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement>,
		@Optional() @Self() public ngControl: NgControl,
		@Optional() private _parentForm: NgForm,
		@Optional() private _parentFormGroup: FormGroupDirective,
		@Optional() @Self() @Inject(DMND_INPUT_VALUE_ACCESSOR) inputValueAccessor: any,
		private _defaultErrorStateMatcher: ErrorStateMatcher,
	) {
		const element: HTMLInputElement | HTMLSelectElement = this._elementRef.nativeElement

		this._inputValueAccessor = inputValueAccessor || element

		const nodeName = element.nodeName.toLowerCase()

		this._isTextArea = nodeName === 'textarea'

		this.id = this.id
	}

	ngDoCheck() {
		if (this.ngControl) {
			this.updateErrorState()
		}
	}

	private updateErrorState() {
		const oldState = this.errorState
		const parent = this._parentFormGroup || this._parentForm
		const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher

		const control = this.ngControl ? (this.ngControl.control as AbstractControl) : null
		const newState = matcher.isErrorState(control, parent)

		if (newState !== oldState) {
			this.errorState = newState
			this.stateChanges.next()
		}
	}

	focus(options?: FocusOptions): void {
		this._elementRef.nativeElement.focus(options)
	}

	_focusChanged(isFocused: boolean) {
		if (isFocused !== this.focused) {
			this.focused = isFocused
			this.stateChanges.next()
		}
	}

	_onInput() {

	}

	onContainerClick(event: MouseEvent): void {
		throw new Error('Method not implemented.')
	}

}
