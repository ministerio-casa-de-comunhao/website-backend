import { getAlbum, getName } from '../services/albumService.js';

async function validateLinks(links) {
    const validLinks = [];
    for (const link of links) {
        if (await checkLinkStatus(link)) {
            validLinks.push(link); // Adiciona ao array apenas os links válidos
        }
    }
    return validLinks;
}

// Controlador para buscar links do álbum
export const getAlbumLinks = async (req, res) => {
    const albumId = req.params.id;

    if (!albumId) {
        return res.status(400).json({ error: "O ID do álbum é obrigatório." });
    }

    try {
        const extractedLinks = await getAlbum(albumId);
        const validatedLinks = await validateLinks(extractedLinks); // Filtra links válidos
        res.status(200).json({name: albumName, validatedLinks});
    } catch (error) {
        console.error("Erro ao acessar o álbum: ", error.message);
        res.status(500).json({ error: "Não foi possível acessar o álbum." });
    }
};

export const getAlbumName = async (req, res) => {
    const albumId = req.params.id;

    if (!albumId) {
        return res.status(400).json({ error: "O ID do álbum é obrigatório." });
    }

    try {
        const albumName = await getName(albumId);  // Isso pode causar um loop infinito
        res.status(200).json({name: albumName});
    } catch (error) {
        console.error("Erro ao acessar o álbum:", error.message);
        res.status(500).json({ error: "Não foi possível acessar o álbum." });
    }
};