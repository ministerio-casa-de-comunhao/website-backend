import express from "express";
import { sendMail } from '../controllers/sendMailController.js';

const sendMailRouter = express.Router();

// Define a rota do Álbum
sendMailRouter.get('/', sendMail);

export default sendMailRouter;