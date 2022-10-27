import type { Component  } from 'vue'
import Input from './Input.vue'
import Textarea from './Textarea.vue'
import Checkbox from './Checkbox.vue'
import Select from './Select.vue'
import Datepicker from './Datepicker.vue'

const FieldTypes: Array<{
        element: Component,
        name: string
    }> = [
    {
        element: Input,
        name: 'INPUT'
    },
    {
        element: Textarea,
        name: 'TEXTAREA'
    },
    {
        element: Checkbox,
        name: 'CHECKBOX'
    },
    {
        element: Select,
        name: 'SELECT'
    },
    {
        element: Datepicker,
        name: 'DATEPICKER'
    },
]

const getFieldTypesNames = (): Array<string>=>{
    return FieldTypes.map((field)=>{
        return field.name
    })
}

const getFieldTypesElements = (): Array<Component>=>{
    return FieldTypes.map((field)=>{
        return field.element
    })
}
const getEnitySelectOptions = (options: Array<string>)=>{
    return options.map((opt: string)=>{ return { label: opt, value: opt }})
}
export {
    getFieldTypesNames,
    getFieldTypesElements,
    getEnitySelectOptions
}