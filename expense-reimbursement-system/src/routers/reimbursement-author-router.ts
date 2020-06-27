import express, { Request, Response } from 'express'
import { Reimbursement } from '../models/reimbursement'

export const reimbursementAuthorRouter = express.Router()

//Find Reimbursement By User (endpoint) *** this isnt working 
/*** add only allowed roles to be finance-manager, 
    or if the id provided matches the id of the current user ***/
reimbursementAuthorRouter.get('/:userId', (req:Request, res:Response) => {
    let {userId} = req.params
    if(isNaN(+userId)) {
        res.status(400).send('UserId Needs to be a Number')
    }
    else {
        let found = false 
        for(const reimbursement of reimbursements) {
            //Might need an array of Reimbursements[] here ***
            if(reimbursement.author === +userId) {
                res.json(reimbursement)
                found = true
            }
        }
        if(!found) {
            res.status(404).send('User Not Found')
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