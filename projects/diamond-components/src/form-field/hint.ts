import { Directive, InjectionToken, Input } from '@angular/core'

let nextUniqueId: number = 0

export const DMND_HINT = new InjectionToken<DmndHint>('DmndHint')

@Directive({
    selector: 'dmnd-hint',
    host: {
        class: 'dmnd-hint',
        '[attr.id]': 'id'
    },
    providers: [{
        provide: DMND_HINT,
        useExisting: DmndHint
    }]
})
export class DmndHint {

    @Input()
    id: string = `dmnd-hint-${nextUniqueId++}`
    
}