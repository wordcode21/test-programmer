const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const loginRoutes = require("./routes/login")
const registerRoutes = require("./routes/register");
const barangRoutes = require("./routes/barang");
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use("/api/",loginRoutes);
app.use("/api",registerRoutes);
app.use("/api",barangRoutes);

app.listen(PORT,()=>{
    console.log(`Server berjalan di http://localhost:${PORT}`);
});