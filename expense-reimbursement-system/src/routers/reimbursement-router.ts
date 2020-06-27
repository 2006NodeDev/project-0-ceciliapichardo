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
reimbursementRouter.patch('/', (req:Request, res:Response) => {
    let { reimbursementId } = req.body
    if(!reimbursementId) { //update request must contain a reimbursementId
        res.status(400).send('Reimbursement Updates Require ReimbursementId and at Least One Other Field')
    }
    else if(isNaN(+reimbursementId)) { //check if reimbursementId is valid
        res.status(400).send('Id Needs to be a Number')
    }
    else {
        let found = false
        for(const reimbursement of reimbursements) {
            if(reimbursement.reimbursementId === +reimbursementId) { //check if reimbursement object exists
                let author = req.body.author //create new author value if it is included in request body
                if(author) { //if author object was created, update reimbursement.author
                    reimbursement.author = author
                }
                let amount = req.body.amount //create new amount value if it is included in request body
                if(amount) { //if amount object was created, update reimbursement.amount
                    reimbursement.amount = amount
                }
                let dateSubmitted = req.body.dateSubmitted //create new dateSubmitted value if it is included in request body
                if(dateSubmitted) { //if dateSubmitted object was created, update reimbursement.dateSubmitted
                    reimbursement.dateSubmitted = dateSubmitted
                }
                let dateResolved = req.body.dateResolved //create new dateResolved value if it is included in request body
                if(dateResolved) { //if dateResolved object was created, update reimbursement.dateResolved
                    reimbursement.dateResolved = dateResolved
                }
                let description = req.body.description //create new description value if it is included in request body
                if(description) { //if description object was created, update reimbursement.description
                    reimbursement.description = description
                }
                let resolver = req.body.resolver //create new resolver value if it is included in request body
                if(resolver) { //if resolver object was created, update reimbursement.resolver
                    reimbursement.resolver = resolver
                }
                let status = req.body.status //create new status value if it is included in request body
                if(status) { //if status object was created, update reimbursement.status
                    reimbursement.status = status
                }
                let type = req.body.type //create new type value if it is included in request body
                if(type) { //if type object was created, update reimbursement.type
                    reimbursement.type = type
                }

                res.json(reimbursement) //return reimbursement object
                found = true
            }
        }
        if(!found) {
            res.status(404).send('Reimbursement Not Found')
        }
    }
})

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