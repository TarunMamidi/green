const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://tarun:170104@cluster0.od9tt3b.mongodb.net/greenk");

const Users = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        required: true,
        enum: ['head', 'manager', 'employee'],
        default: 'employee'
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, password, role } = req.body;
        
        const existingUser = await Users.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ success: false, errors: "User already exists" });
        }

        const user = new Users({ name, password, role });
        await user.save();

        const token = jwt.sign({ user: { id: user._id, name: user.name, role: user.role } }, 'secret_ecom');

        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Signup failed" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await Users.findOne({ name });
        if (!user) {
            return res.status(404).json({ success: false, errors: "User not found" });
        }

        const isPasswordValid = (password === user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, errors: "Incorrect password" });
        }

        const token = jwt.sign({ user: { id: user._id, name: user.name, role: user.role } }, 'secret_ecom');
        res.json({ success: true, token, name: user.name, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Login failed" });
    }
});



app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error:" + error);
    }
});
