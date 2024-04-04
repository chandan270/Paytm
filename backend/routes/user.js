const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { Account, User } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupSchema = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string()
});

const updateSchema = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

router.post('/signup', async (req, res) => {

    const body = req.body;

    const { success } = signupSchema.safeParse(body);

    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const searchUsername = await User.findOne({
        username: body.username
    });

    if(searchUsername) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create({
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })


});

router.post('/signin', async (req, res) => {
    const body = req.body;

    const { success } = signinSchema.safeParse(body);

    if(!success) {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    });

    if(user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.status(200).json({
            token: token
        });
    }
    else {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

});

router.put("/", authMiddleware, async (req, res) => {

    const { success } = updateSchema.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    await User.findByIdAndUpdate(req.userId, req.body);

    res.status(200).json({
        message: "Updated successfully"
    });

} );

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

});

module.exports = router;