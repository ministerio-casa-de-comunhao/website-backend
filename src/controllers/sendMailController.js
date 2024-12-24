import sendEmail from '../services/sendMailService.js';

export const sendMail = async (req, res) => {
    const  {name, email,message} = req.body;

    if (!nome || !email || !message) {
        return res.status(400).send({error: 'Nem todos os campos foram fornecidos.'});
    }

    try {
        const subject = 'Formulário de Contato';
        const text = `Nome: ${nome}\nEmail: ${email}\nMensagem: ${message}`;

        await sendEmail('email@gmail.com', subject, text);

        return res.status(200).send({message: 'Email enviado com sucesso!'});
    } catch (e) {
        console.error('Falha ao enviar o e-mail: ', e.message);
        return res.status(500).send({error: 'Falha ao enviar o e-mail', details: e.message});
    }
};