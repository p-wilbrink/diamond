import { Directive } from '@angular/core'
import { AbstractControl, AbstractControlDirective, NgControl } from '@angular/forms'
import { Observable } from 'rxjs'

@Directive()
export abstract class DmndFormFieldControl<T> {

    value: T | null

    readonly stateChanges: Observable<void>

    readonly id: string

    readonly placeholder: string

    readonly ngControl: NgControl | AbstractControlDirective | null

    readonly focused: boolean

    readonly empty: boolean

    readonly required: boolean

    readonly disabled: boolean

    readonly errorState: boolean

    abstract onContainerClick(event: MouseEvent): void

}