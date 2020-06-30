import express, { Request, Response, NextFunction } from 'express'
import { sessionMiddleware } from './middleware/session-middleware'
import { userRouter } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router'
import { loginWithUsernameAndPassword } from './daos/user-dao'
import { AuthenticationFailureError } from './errors/AuthenticationFailureError'
import { loggingMiddleware } from './middleware/logging-middleware'

/* PARKS AND REC themed reimbursement system!!! */

const app = express() //creates complete express application
app.use(express.json()) //Matches every HTTP verb, middleware
app.use(loggingMiddleware)
app.use(sessionMiddleware)
app.use('/users', userRouter) //Redirect all requests on /users to user-router
app.use('/reimbursements', reimbursementRouter) //Redirect all requests on /reimbursements to reimbursement-router



//Login 
app.post('/login', async (req:Request, res:Response, next:NextFunction) => {
    let username = req.body.username
    let password = req.body.password

    if(!username || !password) {
        throw new AuthenticationFailureError();
    }
    else { 
        try {
            let user = await loginWithUsernameAndPassword(username, password)
            req.session.user = user
            res.json(user)
        } catch (e) {
            next(e)
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

//Set port for sending/receiving requests
app.listen(2002, () => {
    console.log('Server is active');
})
