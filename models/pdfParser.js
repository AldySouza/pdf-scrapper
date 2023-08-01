const parsedPdf = (sequelize, DataTypes) => {
    const PdfParse = sequelize.define('PdfParser', {
        numero_cliente: {
            type: DataTypes.STRING
        },
        vencimento: {
            type: DataTypes.STRING
        },
        energia_eletrica_unid: {
            type: DataTypes.STRING
        },
        energia_eletrica_preco_unit: {
            type: DataTypes.STRING
        },
        energia_eletrica_valor: {
            type: DataTypes.STRING
        },
        energia_injetada_hpf_unid: {
            type: DataTypes.STRING
        },
        energia_injetada_hpf_preco_unit: {
            type: DataTypes.STRING
        },
        energia_injetada_hpf_valor: {
            type: DataTypes.STRING
        },
        energia_comp_sem_icms_unid: {
            type: DataTypes.STRING
        },
        energia_comp_sem_icms_preco_unit: {
            type: DataTypes.STRING
        },
        energia_comp_sem_icms_valor: {
            type: DataTypes.STRING
        },
        contribuicao_ilum_public: {
            type: DataTypes.STRING
        },
        valor_total: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'pdf_parser'
    })

    return PdfParse
}

export default parsedPdf

// module.exports = parsedPdf
