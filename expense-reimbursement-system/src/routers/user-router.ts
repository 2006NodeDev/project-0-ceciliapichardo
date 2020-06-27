import express, { Request, Response } from 'express'
//import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { User } from '../models/user'
import { UserInputError } from '../errors/UserInputError'

export const userRouter = express.Router()
//userRouter.use(authorizationMiddleware) ***include this when ready for AUthorization

//Find All Users (endpoint)
/*** add only allowed roles to be finance-manager ***/
userRouter.get('/', (req:Request, res:Response) => { 
    res.json(users)
})

//Create New Users
userRouter.post('/', (req:Request, res:Response) => {
    console.log(req.body);
    let { userId,
        username,
        password,
        firstName,
        lastName,
        email,
        role } = req.body
    if(userId && username && password && firstName && lastName && email && role) {
        users.push({ userId,
            username,
            password,
            firstName,
            lastName,
            email,
            role })
        res.sendStatus(201) //Is Created
    }
    else {
        throw new UserInputError()
    }
})

//Find Users By Id (endpoint)
/*** add only allowed roles to be finance-manager, 
    or if the id provided matches the id of the current user ***/
userRouter.get('/:id', (req:Request, res:Response) => {
    let {id} = req.params
    if(isNaN(+id)) {
        res.status(400).send('Id Needs to be a Number')
    }
    else {
        let found = false
        for(const user of users) {
            if(user.userId === +id) {
                res.json(user)
                found = true
            }
        }
        if(!found) {
            res.status(404).send('User Not Found')
        }
    }
})

//Update User (endpoint) ***
/*** add only allowed roles to be admin ***/


export let users: User[] = [
    {
        userId: 1,
        username: "denimLover",
        password: "mybeautifulbeautifulCece",
        firstName: "Winston",
        lastName: "Schmidt",
        email: "winstonschmidt@mail.com",
        role: {
            roleId: 1,
            role: "Admin"
        }
    },
    {
        userId: 2,
        username: "winnieTheBish",
        password: "ferguson",
        firstName: "Winston",
        lastName: "Bishop",
        email: "winnie@mail.com",
        role: {
            roleId: 2,
            role: "Finance Manager"
        }
    }
]

/* json
{
    "userId": 3,
    "username": "jessicaDamnDay",
    "password": "craftsAreCool",
    "firstName": "Jessica",
    "lastName": "Day",
    "email": "jessday@gmail.com",
    "role": {
        "roleId": 2,
        "role": "Employee"
    }
}
*/