const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// JDoodle API credentials
const clientId = 'a608ec4cfd7983b2525baf933b064a8'; // Replace with your JDoodle client ID
const clientSecret = 'db1144239a1f96e5d22da7139c24809c6878edc91c8703ca94e44c4932e7579'; // Replace with your JDoodle client secret

app.use(bodyParser.json());

app.post('/run', async (req, res) => {
    const { code, language } = req.body;

    const payload = {
        script: code,
        language: language,
        versionIndex: '0', // JDoodle version index for the selected language
        clientId: clientId,
        clientSecret: clientSecret
    };

    try {
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        res.json({ output: result.output });
    } catch (error) {
        res.json({ error: 'Error executing code.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
