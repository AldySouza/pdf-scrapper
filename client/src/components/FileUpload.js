import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [resultText, setResultText] = useState('');

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'application/pdf'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        }
      })
      .then(response => {

        return response.data
      })
      // aqui
      .then(extratedText => {

        const finalResult = `
            Número do Cliente: ${extratedText.n_cliente},
            Mês de Referência: ${extratedText.mes},
            Data de Vencimento: ${extratedText.vencimento},
            Energia Elétrica: 
                Unidade de Medida: ${extratedText.energia_eletrica_unid},
                Preço Unitário: ${extratedText.energia_eletrica_preco_unit},
                Valor R$: ${extratedText.energia_eletrica_valor},
            Energia Injetada: 
                Unidade de Medida: ${extratedText.energia_injetada_hpf_unid},
                Preço Unitário: ${extratedText.energia_injetada_hpf_preco_unit},
                Valor R$: ${extratedText.energia_injetada_hpf_valor},
            Energia Compensada S/ ICMS: 
                Unidade de Medida: ${extratedText.energia_comp_sem_icms_unid},
                Preço Unitário: ${extratedText.energia_comp_sem_icms_preco_unit},
                Valor R$: ${extratedText.energia_comp_sem_icms_valor},
            Contribuição iluminação pública municipal: ${extratedText.contribuicao_ilum_public},
            Valor Total: ${extratedText.valor_total}
        `
        setResultText(finalResult)

        setTimeout(() => setUploadPercentage(0), 10000);

        const { fileName, filePath } = extratedText;

        setUploadedFile({ fileName, filePath });

        setMessage('File Uploaded');
      });
      
      return res;
      // Clear percentage
      
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  };

  return (
    <Fragment>
    {message ? <Message msg={message} /> : null}
    <form onSubmit={onSubmit}>
      <div className='custom-file mb-4'>
        <input
          type='file'
          className='custom-file-input'
          id='customFile'
          onChange={onChange}
        />
        <label className='custom-file-label' htmlFor='customFile'>
          {filename}
        </label>
      </div>

      <Progress percentage={uploadPercentage} />

      <input
        type='submit'
        value='Upload'
        className='btn btn-primary btn-block mt-4'
      />
    </form>
    {uploadedFile ? (
      <>
      <div className='row mt-5 h-100'>
        <div className='col-md-6 m-auto'>
          <h3 className='text-center'>{uploadedFile.fileName}</h3>
          <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
        </div>
        <div className='w-100 h-100'>
          <textarea className="w-100 h-100" id="resultText" value={resultText} />
        </div>
      </div>
      
    </>
    ) : null}
  </Fragment>
  )
}

export default FileUpload;