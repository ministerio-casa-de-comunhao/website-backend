// livesModel.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Obtenha o diretório atual usando import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Configuração do banco de dados SQLite com caminho correto
const dbPath = path.join(__dirname, '..', 'db', 'lives.db');

// Variável global para o banco de dados
let db;

export const initializeDatabase = async () => {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Criar a tabela de vídeos (caso não exista)
    await db.run(`
        CREATE TABLE IF NOT EXISTS lives (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            link TEXT NOT NULL
        )
    `);

    console.log('Banco de dados inicializado com sucesso!');
};

export const storeLiveVideos = async (liveVideos) => {
    // Verifica se o banco está inicializado
    if (!db) {
        await initializeDatabase();
    }

    // Insere os vídeos no banco de dados
    const insertQuery = 'INSERT OR REPLACE INTO lives (id, title, link) VALUES (?, ?, ?)';
    const insertPromises = liveVideos.map(video =>
        db.run(insertQuery, video.id, video.title, video.link)
    );

    // Aguardar a inserção dos dados
    await Promise.all(insertPromises);

    console.log('Dados armazenados no banco de dados com sucesso!');
};

export const getLivesFromDB = async () => {
    if (!db) {
        await initializeDatabase();
    }
    
    return db.all('SELECT * FROM lives ORDER BY title ASC');
};