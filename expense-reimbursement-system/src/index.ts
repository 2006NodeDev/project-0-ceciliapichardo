import { User } from './models/user'
import express, { Request, Response } from 'express'
//import { UserInputError } from './errors/UserInputError'
//import { Reimbursement } from './models/reimbursement'
//import { ReimbursementStatus } from './models/reimbursement-status'
import { BadCredentialsError } from './errors/BadCredentialsError'
import { AuthenticationFailureError } from './errors/AuthenticationFailureError'
import { sessionMiddleware } from './middleware/session-middleware'
//import { Role } from './models/role'
import { userRouter } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'

/* PARKS AND REC themed reimbursement system!!! */

//This stays at the top of the file
const app = express() //creates complete express application
app.use(express.json()) //Matches every HTTP verb, middleware
app.use(sessionMiddleware)
app.use('/users', userRouter) //Redirect all requests on /users to user-router
app.use('/reimbursements', reimbursementRouter) //Redirect all requests on /reimbursements to reimbursement-router


/******* AVAILABLE ENDPOINTS *******/

//Login (endpoint)
app.post('/login', (req:Request, res:Response) => {
    let username = req.body.username
    let password = req.body.password

    if(!username || !password) {
        throw new BadCredentialsError();
    }
    else {
        let found = false
        for(const user of users) {
            if(user.username === username && user.password === password) {
                req.session.user = user //session middleware not working ***
                res.json(user)
                found = true
            }
        }
        if(!found) {
            throw new AuthenticationFailureError();
        }
    }
})


//Error handler
app.use((err, req, res, next) => {
    if(err.statusCode) { //if it's one of my custom HTTP errors
        res.status(err.statusCode).send(err.message) //send custom error
    }
    else { //not ready for this specific error, debug whatever comes out here
        console.log(err);
        res.status(500).send('Oops, something went wrong')
    }
})

//This stays at the bottom of the file
app.listen(2002, () => {
    console.log('Server is active');
})


let users: User[] = [
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

/*
let roles: Role[] = [
    {
        roleId: 1,
        role: 'Admin'
    },
    {
        roleId: 2,
        role: 'Finance Manager'
    },
    {
        roleId: 3,
        role: 'User'
    }
] */

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