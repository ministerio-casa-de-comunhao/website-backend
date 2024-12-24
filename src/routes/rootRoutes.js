import express from "express";
import rootStats from "../controllers/rootController.js";

const rootRouter = express.Router();

// Define a rota do Álbum
rootRouter.get('/', rootStats);

export default rootRouter;