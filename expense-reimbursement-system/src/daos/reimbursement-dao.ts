import { Reimbursement } from "../models/reimbursement";
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/Reimbursement-DTO-to-Reimbursement-Converter";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementInputError } from "../errors/ReimbursementInputError";

//Get All Reimbursements
export async function getAllReimbursements():Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted", 
                                                r."date_resolved", 
                                                r."description", 
                                                r."resolver", 
                                                rs."status",
                                                rs."status_id",
                                                rt."type",
                                                rt."type_id" from ers.reimbursements r
                                            left join ers.reimbursement_statuses rs
                                                on r."status" = rs."status_id"
                                            left join ers.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            order by r.date_submitted;`)
        return results.rows.map(ReimbursementDTOtoReimbursementConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

//Find Reimbursements By Status
export async function getReimbursementByStatus(status:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description",
                                                r."resolver",
                                                rs."status_id", 
                                                rs."status",
                                                rt."type_id",
                                                rt."type"
                                                    from ers.reimbursements r 
                                            left join ers.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join ers.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                                    where r."status" = $1
                                            order by r.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}


//Find Reimbursements by User
export async function getReimbursementByUserId(userId:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description", r."resolver",
                                                rs."status_id", rs."status",
                                                rt."type_id", rt."type"
                                            from ers.reimbursements r 
                                            left join ers.reimbursement_statuses rs
                                                on r."status" = rs."status_id" 
                                            left join ers.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            left join ers.users u 
                                                on r."author" = u."user_id"
                                                    where u."user_id" = $1
                                            order by r.date_submitted;`, [userId])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}


//Submit Reimbursement
export async function submitReimbursement(newReim:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."type_id" from ers.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newReim.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].type_id 
        
        let results = await client.query(`insert into ers.reimbursements ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursement_id";`,
                                        [newReim.author, newReim.amount, newReim.dateSubmitted,
                                            newReim.description, newReim.status.statusId, typeId]) 
        newReim.reimbursementId = results.rows[0].reimbursement_id
        
        await client.query('COMMIT;')
        return newReim
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new ReimbursementInputError()
        } 
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}


//Update Reimbursements
export async function updateReimbursementInfo(updatedReimbursementInfo:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedReimbursementInfo.author) {
            await client.query(`update ers.reimbursements set "author" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.author, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.amount) {
            await client.query(`update ers.reimbursements set "amount" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.amount, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.dateSubmitted) {
            await client.query(`update ers.reimbursements set "date_submitted" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.dateSubmitted, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.dateResolved) {
            await client.query(`update ers.reimbursements set "date_resolved" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.dateResolved, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.description) {
            await client.query(`update ers.reimbursements set "description" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.description, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.resolver) {
            await client.query(`update ers.reimbursements set "resolver" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursementInfo.resolver, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.status) {
            let statusId = await client.query(`select rs."status_id" from ers.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [updatedReimbursementInfo.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].status_id
            await client.query(`update ers.reimbursements set "status" = $1 
                                where "reimbursement_id" = $2;`, 
                                [statusId, updatedReimbursementInfo.reimbursementId])
        }
        if(updatedReimbursementInfo.type) {
            let typeId = await client.query(`select rt."type_id" from ers.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedReimbursementInfo.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].type_id
            await client.query(`update ers.reimbursements set "type" = $1 
                                where "reimbursement_id" = $2;`, 
                                [typeId, updatedReimbursementInfo.reimbursementId])
        }

        await client.query('COMMIT;')
        return updatedReimbursementInfo
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new ReimbursementInputError()
        }
        console.log(e);
        throw new Error('Unhandled Error')
    } finally {
        client && client.release()
    }
}