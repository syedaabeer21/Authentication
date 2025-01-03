import express from "express"
import connectDB from "./src/db/index.js "
import dotenv from "dotenv"
import userRoutes from "./src/routes/users.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"


const corsOptions = {
  origin: ['http://localhost:5173'], // Allow your frontend during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Include credentials if needed
};
dotenv.config()
const app = express()
const port = 3000

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1' , userRoutes)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });