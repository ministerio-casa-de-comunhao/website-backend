import { initializeDatabase } from "../models/livesModel.js";
import { getLivesFromYouTube } from "../controllers/livesController.js";

export const runOnStart = async () => {
    // Chama a função imediatamente para popular o banco de dados quando o servidor iniciar
    await initializeDatabase(); // Inicializa o banco de dados
    await getLivesFromYouTube(); // Chama para popular o banco de dados imediatamente

    // Função para atualizar as lives a cada 1 hora (ou conforme desejado)
    setInterval(getLivesFromYouTube, 3600000); // 1 hora em milissegundos
}