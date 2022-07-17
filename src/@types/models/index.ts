export interface Timestamp {
    createdAt: string | Date
    updatedAt: string | Date
}

export interface IGenericDocument {
    isDeleted: boolean
    createdBy: string | Date
    updatedBy: string | Date
}

export type UpdateHistory = { updatedBy: string | Date, updatedAt: string | Date }[]
