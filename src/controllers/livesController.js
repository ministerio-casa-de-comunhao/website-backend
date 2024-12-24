import { google } from 'googleapis';
import { format } from 'date-fns';
import { getLivesFromDB, storeLiveVideos } from '../models/livesModel.js';

// Inicializar API do Youtube Data API v3
const youtube = google.youtube('v3');

// API para listar as lives do banco de dados
export const getLives = async (req, res) => {
    try {
        const lives = await getLivesFromDB();
        res.json(lives);
    } catch (error) {
        console.error('Erro ao listar lives:', error.message);
        res.status(500).json({ error: 'Erro ao listar as lives.' });
    }
};

// Função para buscar todas as lives completas do YouTube
export const getLivesFromYouTube = async () => {
    let allLives = [];
    let nextPageToken = null;

    try {
        do {
            const response = await youtube.search.list({
                part: 'snippet',
                channelId: process.env.CHANNEL_ID, // ID do canal
                maxResults: 50, // Número máximo por página
                eventType: 'completed', // Apenas transmissões finalizadas
                type: 'video', // Apenas vídeos
                key: process.env.GCLOUD_KEY, // Chave da API
                pageToken: nextPageToken, // Token da próxima página (se existir)
            });

            const liveVideos = response.data.items.map(video => {
                const rawDate = video.snippet.publishedAt; // Data ISO 8601
                const formattedDate = format(new Date(rawDate), 'dd/MM/yyyy HH:mm'); // Formata para "30/10/2024 22:46"

                return {
                    id: video.id.videoId,
                    title: video.snippet.title,
                    link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    date: formattedDate,
                };
            });

            allLives.push(...liveVideos); // Adiciona os vídeos da página atual à lista
            nextPageToken = response.data.nextPageToken; // Atualiza o token para a próxima página

        } while (nextPageToken); // Continua enquanto houver mais páginas

        console.log(`Total de transmissões encontradas: ${allLives.length}`);

        // Armazena no banco de dados
        await storeLiveVideos(allLives);
    } catch (error) {
        console.error('Erro ao buscar lives do YouTube:', error.message);
        throw error;
    }
};