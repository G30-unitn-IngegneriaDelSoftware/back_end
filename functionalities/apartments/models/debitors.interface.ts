export interface Debitor{
    username: string,
    import: number
}

export interface DebitorArray{
    member: string,
    debitors: Debitor[]
}