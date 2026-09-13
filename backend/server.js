const express = require("express"); /* imports the express module */
require("dotenv").config();
const mongoose = require("mongoose"); /* imports mongoose module */
const petRoutes = require("./routes/pets"); /* imports pet routes */
const vaccinationRoutes = require("./routes/vaccinations");
const medicineRoutes = require("./routes/medicines");
const vetVisitRoutes = require("./routes/vetVisits");
const authRoutes = require("./routes/auth");
const vaccinationReminderRoutes = require("./routes/vaccinationReminders");
const analyticsRoutes = require("./routes/analytics");

console.log(process.env.MONGODB_URI);
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))

    .catch((err) => {
        console.log("Connection failed");
        console.error(err);
    });

const app = express(); /* builds app */
const PORT = 5000; /* sets port */
const cors = require("cors");
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json()); /* allows express to parse json data */

app.use("/pets", petRoutes); /* uses pet routes for /pets path */
app.use("/pets/:petId/vaccinations", vaccinationRoutes);
app.use("/pets/:petId/medicines", medicineRoutes);
app.use("/pets/:petId/vetVisits", vetVisitRoutes);
app.use("/auth", authRoutes);
app.use("/vaccinations", vaccinationReminderRoutes); /* uses vaccination reminder routes for /vaccinations path */
app.use("/analytics", analyticsRoutes);
app.listen(PORT, () => { /* actually starts the server and listens on the port */
    console.log(`Server running on port ${PORT}`); /* logs on terminal */
});