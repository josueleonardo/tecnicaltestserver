const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

app.use(express.json());

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String
});

const Article = mongoose.model('Article', articleSchema);

const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
    console.error('Error al leer el archivo:', err);
    return;
}

const articles = JSON.parse(data);
Article.insertMany(articles)
    .then(() => console.log('Datos cargados exitosamente'))
    .catch(err => console.error('Error al cargar datos:', err));
});

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener artículos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
