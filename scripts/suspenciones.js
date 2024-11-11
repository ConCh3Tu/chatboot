const { writeToSheet, readSheet } = require('./sheets');

const data = {            
    id : '',            
    fecha : '',                
    descripcion: '',
    
};
// Obtener y parsear los datos desde Google Sheets MENU APP
async function getParsedDataSuspenciones() {

    const lista = await readSheet("RESTRICCIONES!A1:D30");

    if (!lista) {
        throw new Error('No se pudieron leer las suspenciones de Google Sheets.');
    }

    // Encuentra la fila de encabezado dinámicamente
    const headerRow = lista.find(row => row.includes('ID'));

    if (!headerRow) {
        throw new Error('No se encontró la fila de encabezado.');
    }

    const headerIndex = lista.indexOf(headerRow);
    const headers = headerRow.slice(1); // Ignora el primer elemento vacío

    // Extrae los datos a partir de la fila de encabezado
    const rows = lista.slice(headerIndex + 1);

    return rows.map((row, index) => {          
        const men = {                        
            id : row[headers.indexOf('ID') + 1] || '',            
            fecha : row[headers.indexOf('FECHA') + 1] || '',            
            descripcion : row[headers.indexOf('DESCRIPCION') + 1] || ''            
        };        
        return men;
    });
    
}

module.exports = {getParsedDataSuspenciones}