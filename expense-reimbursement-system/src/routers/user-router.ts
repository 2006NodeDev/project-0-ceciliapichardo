import express, { Request, Response } from 'express'
//import { authorizationMiddleware } from '../middleware/authorization-middleware'
import { User } from '../models/user'
import { UserInputError } from '../errors/UserInputError'

export const userRouter = express.Router()
//userRouter.use(authorizationMiddleware) ***include this when ready for AUthorization

//Find All Users (endpoint)
/*** add only allowed roles to be finance-manager ***/
// authorizationMiddleware(['admin']),
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
    // authorizationMiddleware(['admin', 'finance-manager']),
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
// authorizationMiddleware(['admin']),
userRouter.patch('/', (req:Request, res:Response) => {
    let { userId } = req.body
    if(!userId) { //update request must contain a userId
        res.status(400).send('User Updates Require UserId and at Least One Other Field')
    }
    else if(isNaN(+userId)) { //check if userId is valid
        res.status(400).send('Id Needs to be a Number')
    }
    else {
        let found = false
        for(const user of users) {
            if(user.userId === +userId) { //check if user exists
                let username = req.body.username //create new username value if it is included in request body
                if(username) { //if username object was created, update user.username
                    user.username = username
                }
                let password = req.body.password //create new password value if it is included in request body
                if(password) { //if password object was created, update user.password
                    user.password = password
                }
                let firstName = req.body.firstName //create new firstName value if it is included in request body
                if(firstName) { //if firstName object was created, update user.firstName
                    user.firstName = firstName
                }
                let lastName = req.body.lastName //create new lastName value if it is included in request body
                if(lastName) { //if lastName object was created, update user.lastName
                    user.lastName = lastName
                }
                let email = req.body.email //create new email value if it is included in request body
                if(email) { //if email object was created, update user.email
                    user.email = email
                }
                let role = req.body.role //create new role value if it is included in request body
                if(role) { //if role object was created, update user.username
                    user.role = role
                }

                res.json(user) //return user object
                found = true
            }
        }
        if(!found) {
            res.status(404).send('User Not Found')
        }
    }
})


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