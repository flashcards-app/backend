export const isAdmin = (role: string): boolean => {
    return role === 'admin' || role === 'super-admin'
}
