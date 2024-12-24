import express from "express";
import { getLives } from '../controllers/livesController.js';

const livesRouter = express.Router();

// Define a rota do Álbum
livesRouter.get('/', getLives);

export default livesRouter;