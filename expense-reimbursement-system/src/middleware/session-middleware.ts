import session, { SessionOptions } from 'express-session'

const sessionConfig:SessionOptions = {
    secret: 'secret', //do not do this in production
    cookie:{
        secure: false
    },
    resave: false,
    saveUninitialized:false
}

export const sessionMiddleware = session(sessionConfig)