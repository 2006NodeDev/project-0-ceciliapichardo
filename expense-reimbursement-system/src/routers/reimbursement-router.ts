import express, { Request, Response, NextFunction } from 'express'
import { UserInputError } from '../errors/UserInputError'
import { reimbursementStatusRouter } from './reimbursement-status-router'
import { reimbursementAuthorRouter } from './reimbursement-author-router'
import { Reimbursement } from '../models/reimbursement'
import { submitReimbursement, updateReimbursementInfo, getAllReimbursements } from '../daos/reimbursement-dao'
import { authenticationMiddleware } from '../middleware/authentication-middleware'
import { authorizationMiddleware } from '../middleware/authorization-middleware'

export const reimbursementRouter = express.Router()

reimbursementRouter.use(authenticationMiddleware)
//Redirect all requests on /reimbursement/status to reimbursement-status-router
reimbursementRouter.use('/status', reimbursementStatusRouter)
//Redirect all requests on /reimbursement/author/userId to reimbursement-author-router
reimbursementRouter.use('/author/userId', reimbursementAuthorRouter)

//Get All Reimbursements
reimbursementRouter.get('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => { 
    try {
        let allReims = await getAllReimbursements()
        res.json(allReims)
    } catch (e) {
        next(e)
    }
})

//Submit Reimbursement
reimbursementRouter.post('/', authorizationMiddleware(['Admin', 'Finance Manager', 'User']), async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    let { 
        author,
        amount,
        dateSubmitted,
        description,
        status,
        type } = req.body
    if(author && amount && dateSubmitted && description && status && type) {
        let newReim: Reimbursement = {
            reimbursementId: 0,
            author,
            amount,
            dateSubmitted,
            dateResolved: null,
            description,
            resolver: null,
            status,
            type
        }
        newReim.type = type || null
        try {
            let savedReim = await submitReimbursement(newReim)
            res.json(savedReim)
        } catch (e) {
            next(e)
        }
    }
    else {
        throw new UserInputError()
    }
})


//Update Reimbursement, we assume Admin and Finance Manager have userId for each user
reimbursementRouter.patch('/', authorizationMiddleware(['Admin', 'Finance Manager']), async (req:Request, res:Response, next:NextFunction) => {
    let { reimbursementId,
        author,
        amount,
        dateSubmitted,
        dateResolved,
        description,
        resolver,
        status,
        type } = req.body
    if(!reimbursementId) { //update request must contain a reimbursementId
        res.status(400).send('Reimbursement Updates Require ReimbursementId and at Least One Other Field')
    }
    else if(isNaN(+reimbursementId)) { //check if reimbursementId is valid
        res.status(400).send('Id Needs to be a Number')
    }
    else { 
        let updatedReimInfo:Reimbursement = { 
            reimbursementId, 
            author,
            amount,
            dateSubmitted,
            dateResolved,
            description,
            resolver,
            status,
            type
        }
        updatedReimInfo.author = author || undefined
        updatedReimInfo.amount = amount || undefined
        updatedReimInfo.dateSubmitted = dateSubmitted || undefined
        updatedReimInfo.dateResolved = dateResolved || undefined
        updatedReimInfo.description = description || undefined
        updatedReimInfo.resolver = resolver || undefined
        updatedReimInfo.status = status || undefined
        updatedReimInfo.type = type || undefined
        try {
            let results = await updateReimbursementInfo(updatedReimInfo)
            res.json(results)
        } catch (e) {
            next(e)
        }
    }
})
