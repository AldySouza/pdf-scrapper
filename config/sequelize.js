import Sequelize from 'sequelize';
import * as config from './database.js';

export const sequelize = new Sequelize(config)

