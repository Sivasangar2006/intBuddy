const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/run-code', async (req, res) => {
    const { script, language } = req.body;

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            script,
            language,
            versionIndex: '0',
            stdin: '',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'client-id': 'a608ec4cfd7983b2525baf933b064a8',  // Replace with your JDoodle client ID
                'client-secret': 'db1144239a1f96e5d22da7139c24809c6878edc91c8703ca94e44c4932e7579',  // Replace with your JDoodle client secret
            },
        });

        res.send(response.data);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).send({ error: 'Error executing code' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
