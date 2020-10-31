import { Operator } from '../models/enums/Operator'

export function getLabel(label: Operator | 'all' | string, returnName: boolean = false): string {
    console.log('label', label)
    switch (label) {
        case Operator.Addition:
            return returnName ? 'Addisjon' : '&#43;'
        case Operator.Subtraction:
            return returnName ? 'Subtraksjon' : '&#8722;'
        case Operator.Multiplication:
            return returnName ? 'Multiplikasjon' : '&#215;'
        case Operator.Division:
            return returnName ? 'Divisjon' : '&#247;'
        case 'all':
            return returnName ? 'Alle' : '&#8704'
        default:
            return label
    }
}