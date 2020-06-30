import express, { Request, Response, NextFunction } from 'express'
import { getReimbursementByStatus } from '../daos/reimbursement-dao'

export const reimbursementStatusRouter = express.Router()

//Find Reimbursement By Status
/*** add only allowed roles to be finance-manager ***/
reimbursementStatusRouter.get('/:statusId', async (req:Request, res:Response, next:NextFunction) => {
    let { statusId } = req.params
    if(isNaN(+statusId)) {
        res.status(400).send('StatusId Needs to be a Number')
    }
    else { 
        try {
            let reimById = await getReimbursementByStatus(+statusId)
            res.json(reimById)
        } catch (e) {
            next(e)
        }
    }
})
