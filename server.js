const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));



--------------------



const adminRoutes = require("./routes/admin");

app.use("/api/admin", adminRoutes);
