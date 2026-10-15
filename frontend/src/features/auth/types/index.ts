export type UserType = {
    _id: string,
    name: string,
    email: string,
    avatar?: string,
    credits: number
}
export type AuthResponse = {
    user: UserType,
    message: string,
    accessToken?: string,
}

export type UserState = {
    userData: UserType | null;
}
