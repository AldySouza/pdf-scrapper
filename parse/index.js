'use strict';

// const pdfParse = require('pdf-parse');
import { PdfReader } from 'pdfreader';

import {parse} from './parse.js';

export class Parser {

  constructor (options) {

    this.reader = new PdfReader();

  }

  async parse (buffer) {

    try {
      const data = await parse(buffer, this.reader);
      const outputString = JSON.stringify(data, null, 2);

      return outputString;
    } catch (err) {
      console.error(err);
    }

  }

}
