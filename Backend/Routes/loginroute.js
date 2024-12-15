import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from "../Models/adminSet.js";
import { Player } from "../Models/playerSet.js";
import { authenticate } from "../Middleware/auth.js";

const loginroute = Router();
const SecretKey = process.env.secretKey

loginroute.post('/login', async (req, res) => {

    try {
        let result;
        const { Email, Password } = req.body

        result = await Admin.findOne({ dbEmail: Email })

        if (result && result.dbRole == 'admin') {

            const isvalid = await bcrypt.compare(Password, result.dbPassword)
            if (isvalid) {
                const token = jwt.sign(
                    { username: result.dbUsername, userrole: result.dbRole },
                    SecretKey,
                    { expiresIn: '1h' }
                )
                res.cookie('AuthToken', token, { httpOnly: true, SameSite: 'Lax', Secure: true });
                console.log("Login successfull");
                res.status(200).json({message: 'Success'})
            }
            else {
                res.status(404).json({ message: "Incorrect credentials" })
                console.log("Please check your credentials");
            }
        }
        else {

            result = await Player.findOne({ dbEmail: Email })
            console.log('player: ', result);
            if (result.dbRole == 'User') {

                const isvalid = await bcrypt.compare(Password, result.dbPassword)
                if (isvalid) {
                    const token = jwt.sign(
                        { username: result.dbUsername, userrole: result.dbRole },
                        SecretKey,
                        { expiresIn: '1h' }
                    )
                    res.cookie('AuthToken', token, { httpOnly: true, SameSite: 'Lax', Secure: true });
                    console.log("Login successfull");
                    res.status(200).json({message: 'Success'})
                }
                else {
                    res.status(404).json({ message: "Incorrect credentials" })
                    console.log("Please check your credentials");
                }
            }
            else {

                res.status(404).json({ message: "Please register" })
                console.log("Not authorised");
            }
        }
    }
    catch (error) {
        res.status(404).json(error)
        console.log('Error occurred while login');
    }
})

    loginroute.get('/protected-route', authenticate, async (req, res) => {

        const username = req.username
        const role = req.userrole
        try {

            res.json({
                message: 'Authorized Person',
                role: role,
                name: username 
            })
        // const existingUser = await Admin.findOne({ dbUsername: username })
        // if (existingUser && role == 'admin') {

        //     res.status(200).json({ role: existingUser.dbRole, name: existingUser.dbUsername })
        //     console.log('Authorized Person');
        // }
        // else {
        //     const existingUser = await Player.findOne({ dbUsername: username })
        //     if (existingUser && role == 'User') {
        //         res.status(200).json({ role: existingUser.dbRole, name: existingUser.dbUsername })
        //         console.log('Registered User');
        //     }
        // }

    }
    catch (error) {

        console.log('Issue in verifying');

    }
})

loginroute.post("/logout", (req, res) => {

    res.clearCookie('AuthToken');
    res.status(200).json({ message: 'Logged out successfully' });
});


export { loginroute }
