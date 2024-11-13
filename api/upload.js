// 1º vamos importar as dependências
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Importa a função de tratamento de dados
const processExcel = require('../data/data_processing'); // Certifique-se de que o caminho esteja correto

const app = express();

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, '/tmp'); // Salva o arquivo temporariamente na pasta '/tmp'
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname)); // Nomeia o arquivo com a data para evitar duplicações no upload
    }
});

// Configuração do upload com Multer
const upload = multer({ storage: storage });

// Rota principal para upload e conversão do arquivo .xlsx para JSON
app.post('/upload', upload.single('file'), (req, res) => {  // Define a rota como "/"
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    // Caminho completo do arquivo carregado
    const filePath = path.join('/tmp', req.file.filename);

    try {
        // Lê e processa os dados da planilha
        const jsonData = processExcel(filePath);

        // Exclui o arquivo temporário após a leitura
        fs.unlinkSync(filePath);

        // Retorna os dados da planilha em JSON
        res.json(jsonData);
    } catch (error) {
        console.error('Erro ao processar a planilha:', error);
        res.status(500).send('Erro ao processar planilha');
    }
});

// Exporta o app para que o Vercel possa utilizá-lo como uma função serverless
module.exports = app;
