import type { DefaultOptionType } from 'rc-select/lib/Select'
export interface Field {
    id?: string
    title: string;
    name: string;
    inputType: number,
    required: boolean,
    options?: Array<DefaultOptionType>
    default?: any
}

export interface FieldError {
    description: string,
    extra: string | Array<string>,
    status: number
}

export interface FieldState {
    list: Array<Field>,
    fieldAssociations: {
        [key: string]: string
    },
    count: number,
    limit: number,
    page: number,
    loading: boolean,
    error: FieldError | false
}
export const FieldInputTypes = [
    'INPUT',
    'TEXTAREA',
    'CHECKBOX',
    'SELECT',
    'DATEPICKER'
]