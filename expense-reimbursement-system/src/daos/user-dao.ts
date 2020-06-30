import { PoolClient } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConverter } from "../utils/User-DTO-to-User-Converter";
import { User } from "../models/user";
import { UserInputError } from "../errors/UserInputError";
import { AuthenticationFailureError } from "../errors/AuthenticationFailureError";
import { UserNotFoundError } from "../errors/UserNotFoundError";

//Find All Users
export async function getAllUsers():Promise<User[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."role" from ers.users u
                                            left join ers.roles r 
                                            on u."role" = r."role_id";`)
        return results.rows.map(UserDTOtoUserConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Create New Users
export async function saveAUser(newUser:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" 
                                        from ers.roles r 
                                        where r."role" = $1`,
                                        [newUser.role])
        if(roleId.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into ers.users 
                                        ("username", "password", 
                                            "first_name", "last_name", 
                                            "email", "role")
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "user_id"`,
                                        [newUser.username, newUser.password, 
                                            newUser.firstName, newUser.lastName, 
                                            newUser.email, roleId])
        newUser.userId = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Login a User
export async function loginWithUsernameAndPassword(username:string, password:string):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."role" from ers.users u
                                        left join ers.roles r 
                                        on u."role" = r."role_id"
                                        where u."username" = $1 
                                            and u."password" = $2;`,
                                        [username, password])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new AuthenticationFailureError()
        }
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Find User by Id
export async function getUserById(id:number):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                                 u."username", 
                                                 u."password", 
                                                 u."first_name",
                                                 u."last_name",
                                                 u."email",
                                                 r."role_id", 
                                                 r."role" 
                                              from ers.users u 
                                            left join ers.roles r 
                                              on u."role" = r."role_id" 
                                                where u."user_id" = $1;`, [id])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0]) //should only be one row with the user corresponding to ID
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new UserNotFoundError()
        }
        //For errors we don't recognize
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Update User Info
export async function updateUserInfo(updatedUserInfo:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedUserInfo.username) {
            await client.query(`update ers.users set "username" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.username, updatedUserInfo.userId])
        }
        if(updatedUserInfo.password) {
            await client.query(`update ers.users set "password" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.password, updatedUserInfo.userId])
        }
        if(updatedUserInfo.firstName) {
            await client.query(`update ers.users set "first_name" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.firstName, updatedUserInfo.userId])
        }
        if(updatedUserInfo.lastName) {
            await client.query(`update ers.users set "last_name" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.lastName, updatedUserInfo.userId])
        }
        if(updatedUserInfo.email) {
            await client.query(`update ers.users set "email" = $1 
                                    where "user_id" = $2;`, 
                                    [updatedUserInfo.email, updatedUserInfo.userId])
        }
        if(updatedUserInfo.role) {
            let roleId = await client.query(`select r."role_id" from ers.roles r 
                                        where r."role" = $1`,
                                        [updatedUserInfo.role])
            if(roleId.rowCount === 0) {
                throw new Error('Role Not Found')
            }
            roleId = roleId.rows[0].role_id
            await client.query(`update ers.users set "role" = $1 
                                    where "user_id" = $2;`, 
                                    [roleId, updatedUserInfo.userId])
        }

        await client.query('COMMIT;')
        return updatedUserInfo
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('Unhandled Error')
    } finally {
        client && client.release()
    }
}
