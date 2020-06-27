import { HttpError } from "./HttpError";


export class AuthenticationFailureError extends HttpError {
    constructor() {
        super(400, 'Invalid Credentials')
    }
}