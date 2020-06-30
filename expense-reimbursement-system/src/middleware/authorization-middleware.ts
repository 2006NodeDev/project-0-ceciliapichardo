import { Request, Response, NextFunction } from "express"
import { AuthorizationFailureError } from "../errors/AuthorizationFailureError"
import { Role } from "../models/role"

//*** fix this to connect to Role model, still not working 
export function authorizationMiddleware(roles:string[]) {
    return  (req:Request, res:Response, next:NextFunction) => {
        let allowed = false
        for(const role of roles) { //***maybe get this to talk to the database */
            if(req.session.user.role === role) {
                allowed = true
                next()
            }
            //I think i need more here ***
        }
        if(!allowed) {
            throw new AuthorizationFailureError()
        }
    }
}
export let roles:Role[] = [
    {
        role:"Admin",
        roleId: 1
    },
    {
        role:"Finance Manager",
        roleId: 2
    },
    {
        role:"User",
        roleId: 3
    }
]