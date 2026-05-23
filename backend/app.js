// Import das dependências para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON na body das requisições
const bodyParserJSON = bodyParser.json()

// Criando um objeto do express para criar a API
const app = express()

// Configurações do CORS da API
const corsOptions = {
    origin: ['*'],
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-type', 'Authorization']
}

// Aplica as configurações no CORS no app (EXPRESS)
app.use(cors(corsOptions))