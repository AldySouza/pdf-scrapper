import express from 'express';
import fileupload from 'express-fileupload';
import pdfParse from 'pdf-parse';
import {Parser} from './parse/index.js';

import { db } from './models/index.js';

const app = express();

app.use(fileupload());

db.sequelize.sync().then(() => {
    console.log('conectado com o db');
})

app.post('/upload', (req, res) => {
    if(!req.files && !req.files.file) {
        res.status(400);
        res.end();
    }
    const parser = new Parser();

    pdfParse(req.files.file).then(async result => {
        const parserResult = await parser.parse(req.files.file.data, result)
        
        const toSave = JSON.parse(parserResult)

        await db.pdfParser.create(toSave)
        res.send(parserResult)
    })
})

app.listen(3334)