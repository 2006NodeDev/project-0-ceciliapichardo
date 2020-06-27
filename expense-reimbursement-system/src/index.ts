import { User } from './models/user'
import express, { Request, Response } from 'express'
import { UserInputError } from './errors/UserInputError'
import { Reimbursement } from './models/reimbursement'
import { ReimbursementStatus } from './models/reimbursement-status'
import { BadCredentialsError } from './errors/BadCredentialsError'
import { AuthFailureError } from './errors/AuthFailureError'
import { sessionMiddleware } from './middleware/session-middleware'

//This stays at the top of the file
const app = express() //creates complete express application
app.use(express.json()) //Matches every HTTP verb, middleware
app.use(sessionMiddleware)

/******* SECURITY ?? *******/

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
            throw new AuthFailureError();
        }
    }
})

//Find Users (endpoint)
/*** add only allowed roles to be finance-manager ***/
app.get('/users', (req:Request, res:Response) => { 
    res.json(users)
})

//Create new users
app.post('/users', (req:Request, res:Response) => {
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
app.get('/users/:id', (req:Request, res:Response) => {
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


//Find Reimbursement By Status ***
/*** add only allowed roles to be finance-manager ***/
app.get('/reimbursements/status/:statusId', (req:Request, res:Response) => {
    let {statusId} = req.params
    if(isNaN(+statusId)) {
        res.status(400).send('Status Id Needs to be a Number')
    }
    else {
        let found = false
        for(const reimbursementStatus of reimbursementStatuses) {
            if(reimbursementStatus.statusId === +statusId) {
                res.json(reimbursementStatus) //*** this is supposed to just be reimbursement
                found = true
            }
        }
        if(!found) {
            res.status(404).send('Status Id Not Found')
        }
    }
})

//Find Reimbursement By User (endpoint) ***
/*** add only allowed roles to be finance-manager, 
    or if the id provided matches the id of the current user ***/
app.get('/reimbursements/author/userId/:userId', (req:Request, res:Response) => {
    /*let {userId} = req.params
    if(isNaN(+userId)) {
        res.status(400).send('User Id Needs to be a Number')
    }
    else {
        let found = false
        for(const reimbursement of reimbursements) {
            if(reimbursement.author === +id) {
                res.json(user)
                found = true
            }
        }
        if(!found) {
            res.status(404).send('User Not Found')
        }
    } */
})

//Submit Reimbursement
app.post('/reimbursements', (req:Request, res:Response) => {
    console.log(req.body);
    let { reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type } = req.body
    if(reimbursementId && author && amount && dateSubmitted && dateResolved && description && resolver && status && type) {
        reimbursements.push({ reimbursementId,
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type })
        res.sendStatus(201) //Created
    }
    else {
        throw new UserInputError()
    }
})


//Update Reimbursement ***
/*** add only allowed roles to be finance-manager ***/

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
            role: "Finance Manager"
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
            role: "Employee"
        }
    }
]

let reimbursements: Reimbursement[] = [
    {
        reimbursementId: 1,
        author: 2,
        amount: 100,
        dateSubmitted: 3,
        dateResolved: 4,
        description: "idk what im doing",
        resolver: 5,
        status: 6,
        type: 7
    },
    {
        reimbursementId: 2,
        author: 3,
        amount: 200,
        dateSubmitted: 4,
        dateResolved: 5,
        description: "idk what im doing pt. 2",
        resolver: 6,
        status: 7,
        type: 8
    }
]
/* 
{
    "reimbursementId": 1,
    "author": 2,
    "amount": 100,
    "dateSubmitted": 3,
    "dateResolved": 4,
    "description": "idk what im doing",
    "resolver": 5,
    "status": 6,
    "type": 7
}
*/
let reimbursementStatuses: ReimbursementStatus[] = [
    {
        statusId: 1,
        status: 'Approved'
    },
    {
        statusId: 2,
        status: 'Pending'
    },
    {
        statusId: 3,
        status: 'Denied'
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