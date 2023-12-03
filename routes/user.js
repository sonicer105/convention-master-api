/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username: user
 *         password: hunter2
 *     Token:
 *       type: object
 *       required:
 *       properties:
 *         token:
 *           type: string
 *           description: The user's authentication token
 *         expiration:
 *           type: number
 *           format: Unix Time
 *           description: When the token will expire
 *       example:
 *         token: abc.123-xyz
 *         expiration: 1701606937
 *   securitySchemes:
 *     ApiKey:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * tags:
 *   name: Token
 *   description:
 * /token:
 *   post:
 *     summary: Gets a login token using a username and password
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: A valid login is supplied and a token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       400:
 *         description: Invalid username or password.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Invalid username or password.
 */
const config = require("config");
const express = require("express");
const router = express.Router();
const auth = require("../util/auth");
const { DateTime } = require("luxon");

router.post("/token", function (req, res) {
	const { username, password } = req.body;

    if(username == config.get('api.username') && password == config.get('api.password')){
        const expiration = DateTime.now().toUnixInteger();
        const token = auth.generateAccessToken({username: username});
        res.json({
            token: token,
            expiration: expiration
        });
        return;
    }

    res.status(400).json({status:"error", message:"Invalid username or password."});
});

module.exports = router;
