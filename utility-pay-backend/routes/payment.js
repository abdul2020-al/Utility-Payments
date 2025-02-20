const express = require("express");
const Stripe = require("stripe");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pay a Bill
router.post("/pay", authMiddleware, async (req, res) => {
    try {
        const { billId, paymentMethodId } = req.body;
        const userId = req.user.id;

        // Find the bill
        const bill = await Bill.findById(billId);
        if (!bill) return res.status(404).json({ msg: "Bill not found" });

        if (bill.status === "Paid") return res.status(400).json({ msg: "Bill already paid" });

        // Process payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: bill.amount * 100, // Convert to cents
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Update bill status to "Paid"
        bill.status = "Paid";
        await bill.save();

        // Save payment record
        const payment = new Payment({
            userId,
            billId,
            amount: bill.amount,
            paymentMethod: "Card",
            transactionId: paymentIntent.id,
            status: "Success",
        });

        await payment.save();

        res.json({ msg: "Payment successful", paymentIntent });
    } catch (err) {
        res.status(500).json({ msg: "Payment failed", error: err.message });
    }
});

module.exports = router;
