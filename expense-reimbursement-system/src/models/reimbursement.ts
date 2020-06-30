//Reimbursement model is used to represent a single reimbursement that an employee would submit

export class Reimbursement {
    reimbursementId: number //primary key
    author: number //foreign key -> user not null
    amount: number //not null
    dateSubmitted: number//Date //not null
    dateResolved: number //Date //not null **** see if you can make this null for Pending 
    description: string //not null
    resolver: number // foreign key -> User
    status: number //foreign key -> ReimbursementStatus, not null
    type: number //foreign key -> ReimbursementType
}