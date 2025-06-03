import cors from "cors";
import env from "dotenv";
import express from "express";
import userRoutes from "./routes/user.Routes";
// import productRoutes from "./routes/product.Routes";

env.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

export default app;

