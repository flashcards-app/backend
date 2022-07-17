export type UpdateUserBody = {
    isDeleted: boolean
    id: string
    email: string
    password: string
    name: string
    role: string
}

export type UpdateUserParams = {
    userId: string
}


export type UpdateLoggedInBody = {
    isDeleted: boolean
    email: string
    password: string
    name: string
}


export type ListUsersQuery = {
    page: string
    perPage: string
    name: string
    email: string
    role: string
}


export type CreateUserBody = {
    email: string
    password: string
    name: string
    role: string
}

export type ReplaceUserBody = {
    email: string
    password: string
    name: string
    role: string
}

export type ReplaceUserParams = {
    userId: string
}

export type RemoveUserBody = {
    isDeleted: boolean
}
