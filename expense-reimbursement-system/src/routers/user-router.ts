import express, { Request, Response, NextFunction } from 'express'
import { UserInputError } from '../errors/UserInputError'
import { getAllUsers, saveAUser, getUserById, updateUserInfo } from '../daos/user-dao'
import { User } from '../models/user'

export const userRouter = express.Router()
//userRouter.use(authorizationMiddleware) ***include this when ready for AUthorization

//Find All Users
/*** add only allowed roles to be finance-manager ***/
// authorizationMiddleware(['admin']),
userRouter.get('/', async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allUsers = await getAllUsers()
        res.json(allUsers)
    } catch (e) {
        next(e)
    }
})

//Create New Users
userRouter.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(username && password && firstName && lastName && email && role) {
        let newUser: User = {
            userId: 0,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        try {
            let savedUser = await saveAUser(newUser)
            res.json(savedUser)
        } catch (e) {
            next(e)
        }
    }
    else {
        //throw new UserInputError()
        next(new UserInputError)
    }
})

//Find Users By Id
/*** add only allowed roles to be finance-manager, 
    or if the id provided matches the id of the current user ***/
    // authorizationMiddleware(['admin', 'finance-manager']),
userRouter.get('/:id', async (req:Request, res:Response, next:NextFunction) => {
    let {id} = req.params
    if(isNaN(+id)) {
        res.status(400).send('Id Needs to be a Number')
    }
    else { 
        try {
            let userById = await getUserById(+id)
            res.json(userById)
        } catch (e) {
            next(e)
        }
    }
})

//Update User, we assume that Admin will have access to UserId for each user
/*** add only allowed roles to be admin ***/
// authorizationMiddleware(['admin']),
userRouter.patch('/', async (req:Request, res:Response, next:NextFunction) => {
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(!userId) { //update request must contain a userId
        res.status(400).send('User Updates Require UserId and at Least One Other Field')
    }
    else if(isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id Needs to be a Number')
    }
    else {
        let updatedUserInfo:User = {
            userId,
            username,
            password,
            firstName,
            lastName,
            email,
            role
        }
        updatedUserInfo.username = username || undefined
        updatedUserInfo.password = password || undefined
        updatedUserInfo.firstName = firstName || undefined
        updatedUserInfo.lastName = lastName || undefined
        updatedUserInfo.email = email || undefined
        updatedUserInfo.role = role || undefined
        try {
            let result = await updateUserInfo(updatedUserInfo)
            res.json(result)
        } catch (e) {
            next(e)
        }
    }
}) 
