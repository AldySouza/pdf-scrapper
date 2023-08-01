import Sequelize from 'sequelize'
import {sequelize} from '../config/sequelize.js'
import PdfParse from './pdfParser.js'

const pdfParser = PdfParse(sequelize, Sequelize.DataTypes);

export const db = {
    pdfParser,
    sequelize
}