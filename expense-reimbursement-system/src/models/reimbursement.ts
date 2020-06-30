//Reimbursement model is used to represent a single reimbursement that an employee would submit

import { ReimbursementStatus } from "./reimbursement-status"
import { ReimbursementType } from "./reimbursement-type"

export class Reimbursement {
    reimbursementId: number //primary key
    author: number //foreign key -> user not null
    amount: number //not null
    dateSubmitted: Date //number //Date //not null
    dateResolved: Date //number //Date //not null **** see if you can make this null for Pending 
    description: string //not null
    resolver: number // foreign key -> User
    status: ReimbursementStatus //foreign key -> ReimbursementStatus, not null
    type: ReimbursementType //foreign key -> ReimbursementType
}
/** had status and type at the wrong types this whole time **/