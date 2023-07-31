'use strict';

import { PdfReader } from 'pdfreader';

function readPDFPages (buffer, reader = new PdfReader()) {

  return new Promise((resolve, reject) => {
    let pages = [];
    reader.parseBuffer(buffer, (err, item) => {

      if (err)
        reject(err)

      else if (!item)
        resolve(pages);

      else if (item.page)
        pages.push({});

      else if (item.text) {
        const row = pages[pages.length-1][item.y] || [];
        row.push(item.text);
        pages[pages.length-1][item.y] = row;
      }

    });
  });

}

function parseBillPDF (pages) {

  const page = pages[0]; // We know there's only going to be one page

  // Declarative map of PDF data that we expect, based on Todd's structure
  const fields = {
    n_cliente: { row: '9.272', index: 0 },
    mes: { row: '3.9219999999999997', index: 0 },
    vencimento: { row: '3.9219999999999997', index: 0 },
    energia_eletrica_unid: { row: '14.856', index: 1 },
    energia_eletrica_preco_unit: { row: '14.856', index: 3 },
    energia_eletrica_valor: { row: '14.856', index: 4 },
    energia_injetada_hpf_unid: { row: '15.456', index: 1 },
    energia_injetada_hpf_preco_unit: { row: '15.456', index: 3 },
    energia_injetada_hpf_valor: { row: '15.456', index: 4 },
    energia_comp_sem_icms_unid: { row: '16.056', index: 1 },
    energia_comp_sem_icms_preco_unit: { row: '16.056', index: 3 },
    energia_comp_sem_icms_valor: { row: '16.056', index: 4 },
    contribuicao_ilum_public: { row: '16.656', index: 1 },
    valor_total: { row: '17.256', index: 1 },
  };

  const data = {};

  // Assign the page data to an object we can return, as per
  // our field specification
  Object.keys(fields)
    .forEach((key) => {

      const field = fields[key];
      let val;

      if(key === 'mes') {
        val = page[field.row][field.index];

        data[key] = val.trim().slice(0, 8);

      } else if (key === 'n_cliente') {
        val = page[field.row][field.index];

        data[key] = val.trim().slice(0, 10);
      } else if (key === 'vencimento') {
        val = page[field.row][field.index];

        data[key] = val.trim().slice(22, 33);
      } else {
        val = page[field.row][field.index];
        data[key] = val.trim();

      }

      // We don't want to lose leading zeros here, and can trust
      // any backend / data handling to worry about that. This is
      // why we don't coerce to Number.

    });

  // Manually fixing up some text fields so theyre usable

  return data;

}

export async function parse (buf, reader) {

  const data = await readPDFPages(buf, reader);
  const parsedData = parseBillPDF(data); 
  return parsedData;

};
