const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // e.g., "Card", "Bank Transfer"
    transactionId: { type: String, required: true }, // Stripe Payment ID
    status: { type: String, enum: ["Success", "Failed"], default: "Success" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
