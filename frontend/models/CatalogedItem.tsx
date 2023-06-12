import { CatalogedTask } from "./Tasks"

export interface ItemOptionValue {
    id: string | number
    label: string
    subtext: string
    isDeleted: boolean
}

export interface ItemOption {
    id: string | number
    key: string
    allowNull: boolean
    allowMulti: boolean
    isDeleted: boolean
    values: ItemOptionValue[]
}

export interface CatalogedItem {
    id: Number | string
    type: string
    subType: string
    description: string
    commissionable: boolean
    sizeable: boolean
    options: ItemOption[]
    tasks: CatalogedTask[]
    isDeleted: boolean
}