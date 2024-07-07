import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailRouter from "./routes/mail.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/api", mailRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
