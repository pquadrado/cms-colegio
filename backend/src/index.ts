import express, { type Application } from 'express'
import dotenv from "dotenv"
import { loginUser } from "./http/router/auth/login-user";
import { validateToken } from './http/router/auth/validate-token';
import { CreateEvent } from './http/router/create-event';
import { upload } from './lib/multerConfig';
import { getAllEvents } from './http/router/get-all-events';
import { getUniqueEvents } from './http/router/get-unique-event';
import { deleteEvent } from './http/router/delete-event';
dotenv.config()

const app: Application = express();

const cors = require("cors");

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5501"],
  })
);

app.use(express.json())
const router = express.Router();

app.post("/login", loginUser)
app.post('/api/validate-token', validateToken);
app.get("/evento", getAllEvents)
app.get("/evento/:id", getUniqueEvents)
app.delete("/evento/:id", deleteEvent)

router.post("/evento", upload.array("images[]"), CreateEvent);

app.use(router)

app.listen(process.env.PORT, () =>
  console.log(`
🚀 Server running`)
);