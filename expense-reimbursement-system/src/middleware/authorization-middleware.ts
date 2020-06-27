import { Request, Response, NextFunction } from "express"
import { AuthorizationFailureError } from "../errors/AuthorizationFailureError"

//*** fix this to connect to Role model, still not working 
export function authorizationMiddleware(roles:string[]) {
    return  (req:Request, res:Response, next:NextFunction) => {
        let allowed = false
        for(const role of roles) {
            if(req.session.user.role.role === role) {
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