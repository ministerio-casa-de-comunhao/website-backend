import express from "express";
import { getAlbumLinks, getAlbumName } from '../controllers/albumController.js';

const albumRouter = express.Router();

// Define a rota do Álbum
albumRouter.get('/:id', getAlbumLinks);
albumRouter.get('/name/:id', getAlbumName)

export default albumRouter;