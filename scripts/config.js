const { writeToSheet, readSheet } = require('./sheets');


const men = {            
    id : '',            
    menu : '',                
    estado: false,
    
};
// Obtener y parsear los datos desde Google Sheets MENU APP
async function getParsedDataMenuApp() {

    const menu = await readSheet("MENU_APP!A1:J10");

    if (!menu) {
        throw new Error('No se pudieron leer los menu de Google Sheets.');
    }

    // Encuentra la fila de encabezado dinámicamente
    const headerRow = menu.find(row => row.includes('ID'));

    if (!headerRow) {
        throw new Error('No se encontró la fila de encabezado.');
    }

    const headerIndex = menu.indexOf(headerRow);
    const headers = headerRow.slice(1); // Ignora el primer elemento vacío

    // Extrae los datos a partir de la fila de encabezado
    const rows = menu.slice(headerIndex + 1);

    return rows.map((row, index) => {
          
         
        const men = {                        
            id : row[headers.indexOf('ID') + 1] || '',            
            menu : row[headers.indexOf('MENU') + 1] || '',            
            estado : row[headers.indexOf('ESTADO') + 1] || ''            
        };
        
        men.id[index] = row[headers.indexOf('ID') + 1] || null;                 

        return men;
    });

    return menu;
}

module.exports = {getParsedDataMenuApp}