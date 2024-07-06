import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mailRouter from "./routes/mail.route.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", mailRouter);

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
