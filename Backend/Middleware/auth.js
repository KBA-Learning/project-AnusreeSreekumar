import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SecretKey = process.env.secretKey

const authenticate = (req, res, next) => {

    const cookies = req.headers.cookie;
    // req.cookies
    // console.log(cookies);
    const cookie = cookies.split(';');
    for (let cooky of cookie) {
        const [name, token] = cooky.trim().split('=');
        if (name == 'AuthToken') {
            const tokenverifcn = jwt.verify(token, SecretKey)
            // console.log("Token in Authfile: ", tokenverifcn);
            req.UserName = tokenverifcn.username;
            req.UserRole = tokenverifcn.userrole;
            // console.log("Username:", tokenverifcn.username);
            break;
        }
    }
    next();
}

export { authenticate }