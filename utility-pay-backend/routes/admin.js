const express = require("express");
const User = require("../models/User");
const Bill = require("../models/Bill");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

// Get all users
router.get("/users", adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Delete a user
router.delete("/users/:id", adminMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Get all bills
router.get("/bills", adminMiddleware, async (req, res) => {
    try {
        const bills = await Bill.find().populate("userId", "name email");
        res.json(bills);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update a bill's status
router.put("/bills/:id", adminMiddleware, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ msg: "Bill not found" });

        bill.status = req.body.status || bill.status;
        await bill.save();

        res.json({ msg: "Bill updated", bill });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
