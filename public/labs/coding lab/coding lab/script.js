const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const clientId = 'a608ec4cfd7983b2525baf933b064a8'; // Replace with your JDoodle client ID
const clientSecret = 'db1144239a1f96e5d22da7139c24809c6878edc91c8703ca94e44c4932e7579'; // Replace with your JDoodle client secret

app.post('/run', async (req, res) => {
    const { code, language } = req.body;

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            script: code,
            language: language,
            versionIndex: "0",
            clientId: clientId,
            clientSecret: clientSecret
        })
    });

    const result = await response.json();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
