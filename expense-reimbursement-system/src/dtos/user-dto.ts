//Representation of User data from database

export class UserDTO {
    user_id: number
	username: string
	password: string
	firstName: string
	lastName: string
    email: string
    role_id: number
    role: string
}