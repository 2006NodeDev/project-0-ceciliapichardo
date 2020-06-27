import express, { Request, Response } from 'express'
import { ReimbursementStatus } from '../models/reimbursement-status'
import { Reimbursement } from '../models/reimbursement'

export const reimbursementStatusRouter = express.Router()

//Find Reimbursement By Status ***
/*** add only allowed roles to be finance-manager ***/
reimbursementStatusRouter.get('/:statusId', (req:Request, res:Response) => {
    let {statusId} = req.params
    //Might need an array of Reimbursements[] here ***
    if(isNaN(+statusId)) {
        res.status(400).send('StatusId Needs to be a Number')
    }
    else {
        let found = false
        for(const reimbursement of reimbursements) {
            if(reimbursement.status === +statusId) {
                res.json(reimbursement)
                found = true
            }
        }
        if(!found) {
            res.status(404).send('Status Id Not Found')
        }
    }
})

export let reimbursementStatuses: ReimbursementStatus[] = [
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