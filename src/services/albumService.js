import axios from 'axios';

const regexPhotoLinks = /\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]*)"/g;
const regexAlbumName = /<div class="cL5NYb">([^<]+)<\/div>/;

const linkCache = new Map();

// Função para extrair links das fotos
export const extractPhotos = (content) => {
    const links = new Set();
    let match;
    while ((match = regexPhotoLinks.exec(content))) {
        links.add(match[1]);
    }
    return Array.from(links);
};

export const getName = async (id) => {
    const albumId = id;
    try {
        const response = await axios.get(`https://photos.app.goo.gl/${albumId}`);

        // Ajuste no regex para encontrar o nome do álbum dentro da tag <div class="cL5NYb">
        const match = regexAlbumName.exec(response.data);

        if (match) {
            return match[1].trim(); // Retorna o nome do álbum
        } else {
            throw new Error("Nome do álbum não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao acessar o álbum:", error.message);
        throw error; // Lança o erro para que possa ser tratado externamente
    }
};



// Função para verificar se o link está acessível com cache
export const checkLinkStatusWithCache = async (link) => {
    // Verifica se o link já foi validado antes
    if (linkCache.has(link)) {
        return { link, status: linkCache.get(link) }; // Retorna o resultado do cache
    }

    try {
        await axios.head(link); // Faz uma requisição HEAD
        linkCache.set(link, true); // Armazena o resultado como válido
        return { link, status: true };
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log(`Erro 429: Excesso de requisições para o link: ${link}`);
        } else {
            console.log(`Erro ao acessar o link ${link}: ${error.message}`);
        }
        linkCache.set(link, false); // Armazena o resultado como inválido
        return { link, status: false };
    }
};

// Função para validar links, usa Promise.all para paralelizar as requisições
export const validateLinksWithCache = async (links) => {
    // Usando Promise.all para verificar todos os links em paralelo
    const results = await Promise.all(links.map(link => checkLinkStatusWithCache(link)));
    
    // Filtra e retorna apenas os links válidos
    return results.filter(result => result.status).map(result => result.link);
};

// Função para fazer a requisição do álbum e extrair links das fotos
export const getAlbum = async (id) => {
    const response = await axios.get(`https://photos.app.goo.gl/${id}`);
    return extractPhotos(response.data);
};