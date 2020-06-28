import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/reimbursement";

//ReimbursementDTO takes objects in database format and converts it to Reimbursement model object
export function ReimbursementDTOtoReimbursementConverter(rdto: ReimbursementDTO): Reimbursement {
    return {
        reimbursementId: rdto.reimbursement_id,
        author: rdto.author,
        amount: rdto.amount,
        dateSubmitted: rdto.date_submitted.getFullYear(),
        dateResolved: rdto.date_resolved.getFullYear(),
        description: rdto.description,
        resolver: rdto.resolver,
        status: rdto.status,
        type: rdto.type,
    }
}