import { Request, Response, NextFunction } from "express"
import { AuthorizationFailureError } from "../errors/AuthorizationFailureError"

//Specifies which roles are allowed to do what 
export function authorizationMiddleware(roles:string[]) {
    return  (req:Request, res:Response, next:NextFunction) => {
        let isAllowed = false
        for(const role of roles) { 
            if(role === req.session.user.role.role) { //has to be .role.role
                isAllowed = true
                next()
                break;
            } 
            else if(role === 'Current') {
                let id = req.url.substring(1)
                console.log(`Session Id: ${req.session.user.userId}`);
                console.log((`Request Id: ${id}`));
                if(req.session.user.userId == id) {
                    isAllowed = true
                    next()
                    break;
                }
            }
        }

        if(!isAllowed) {
            throw new AuthorizationFailureError()
        }
    }
}
