//  importa dependências
const xlsx = require('xlsx');

function processExcel(filePath) {
    try {
        // lê o arquivo .xlsx
        const workbook = xlsx.readFile(filePath);
        // seleciona a primeira aba da planilha
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Converte a aba para JSON
        const data = xlsx.utils.sheet_to_json(sheet);

        // filtra e processa os dados.
        const processedData = data
        .filter(row => row.Desvio < 0 )
        .map(row => ({
            Filial:row.FILIAL, // filtra só a coluna FILIAL
            Desvio:`R$${Math.abs(row.Desvio).toFixed(2).replace('.', ',')}` // filtra só a coluna Desvio
        }));

        return processedData
    } catch (error) {
        console.error('erro ao processar a planilha: ', error);
        throw error;
    }
} 

module.exports = processExcel