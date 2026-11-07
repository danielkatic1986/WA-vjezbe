const express = require('express');

const app = express();
const PORT = 3000;

// GET / -> HTML stranica
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// GET /about -> HTML stranica
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

// GET /users -> JSON
app.get('/users', (req, res) => {
    const users = [
        { id: 1, ime: 'Ivan', prezime: 'Horvat' },
        { id: 2, ime: 'Marija', prezime: 'Kovač' },
        { id: 3, ime: 'Pero', prezime: 'Perić' },
    ];

    res.json(users);
});

app.listen(PORT, (error) => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});
