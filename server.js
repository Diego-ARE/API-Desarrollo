const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    try {
        const { personalizations, from, content } = req.body;
        console.log(JSON.stringify(body, null, 2));

        // Verifica que los datos requeridos estén presentes
        if (!personalizations || !from || !content) {
            return res.status(400).send({ message: 'Faltan datos requeridos' });
        }

        // Verifica que personalizations tenga al menos un destinatario
        if (!personalizations[0].to || !personalizations[0].to[0].email) {
            return res.status(400).send({ message: 'Faltan destinatarios' });
        }

        const emailData = {
            personalizations: [
                {
                    to: personalizations[0].to,
                    subject: personalizations[0].subject || 'Sin Asunto', // Usar un valor por defecto si no hay asunto
                },
            ],
            from: {
                email: from.email,
                name: from.name || 'Remitente Desconocido', // Usar un valor por defecto si no hay nombre
            },
            content: content,
        };

        // Log para depuración
        console.log('Datos del correo que se enviarán:', emailData);

        const response = await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send({ message: 'Error al enviar el correo', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
