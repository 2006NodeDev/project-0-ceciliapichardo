import express, { Request, Response } from 'express'
//import { ReimbursementStatus } from '../models/reimbursement-status'
import { Reimbursement } from '../models/reimbursement'
import { UserInputError } from '../errors/UserInputError'
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursement-author-router'
//import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const reimbursementRouter = express.Router()

//Redirect all requests on /reimbursement/status to reimbursement-status-router
reimbursementRouter.use('/status', reimbursementStatusRouter)
//Redirect all requests on /reimbursement/author/userId to reimbursement-author-router
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter)


//Get all Reimbursements, idk if i really need this but def needs authorization
reimbursementRouter.get('/', (req:Request, res:Response) => {
    res.json(reimbursements)
})


//Submit Reimbursement
// authorizationMiddleware(['admin', 'finance-manager', 'user']),
reimbursementRouter.post('/', (req:Request, res:Response) => {
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
// authorizationMiddleware(['admin', 'finance-manager']),


export let reimbursements: Reimbursement[] = [
    {
        reimbursementId: 1,
        author: 2,
        amount: 100,
        dateSubmitted: 2020,
        dateResolved: 2020,
        description: "idk what im doing",
        resolver: 5,
        status: 2,
        type: 7
    },
    {
        reimbursementId: 2,
        author: 3,
        amount: 200,
        dateSubmitted: 2019,
        dateResolved: 2019,
        description: "idk what im doing pt. 2",
        resolver: 6,
        status: 1,
        type: 8
    }
]
/* 
{
    "reimbursementId": 1,
    "author": 2,
    "amount": 100,
    "dateSubmitted": 2020,
    "dateResolved": 2020,
    "description": "idk what im doing",
    "resolver": 5,
    "status": 3,
    "type": 7
}
*/