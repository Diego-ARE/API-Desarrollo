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
        const { name, email, subject, message } = req.body;

        // Verifica que los datos requeridos estén presentes
        if (!name || !email || !subject || !message) {
            return res.status(400).send({ message: 'Faltan datos requeridos' });
        }

        const emailData = {
            personalizations: [
                {
                    to: [{ email: 'darevaloh1@miumg.edu.gt' }],
                    subject: `Nuevo caso de contacto: ${subject}`,
                },
            ],
            from: { 
                email: email, 
                name: name // Agregar el nombre del remitente aquí
            },
            content: [
                {
                    type: 'text/plain',
                    value: message, // Mensaje del contacto
                },
                {
                    type: 'text/html', // Agrega un bloque de contenido en formato HTML (opcional)
                    value: `<p>${message}</p>`
                }
            ],
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
