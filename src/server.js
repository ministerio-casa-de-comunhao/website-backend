import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import albumRouter from './routes/albumRoutes.js';
import livesRouter from './routes/livesRoutes.js';
import rootRouter from './routes/rootRoutes.js';
import sendMailRouter from './routes/sendMailRoutes.js';
import { runOnStart } from './utils/onStart.js';

// Inicializar .env (process.env)
dotenv.config();

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 9000;

// BodyParser no Express
app.use(bodyParser.json());

// Rotas
app.use("/", rootRouter)
app.use('/api/album', albumRouter);
app.use('/api/getLives', livesRouter);
app.use('/api/contact/send', sendMailRouter);

// Rodar ao iniciar o Servidor
runOnStart();

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});