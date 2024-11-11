const { writeToSheet, readSheet } = require('./sheets');
const moment = require('moment');
require('moment/locale/es'); // Importa el idioma español
moment.locale('es');

const ev = {            
    id : '',            
    evento : '',                
    fecha: '',
    link: '',
    
};
// Obtener y parsear los datos desde Google Sheets MENU APP
async function getParsedDataAventos() {

    moment.locale('es');
    // Formatea 
    const mesHoy = moment(new Date()).format('MM');

    const menu = await readSheet("EVENTOS!A1:D100");

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
        
        let ev = null;
        let fech = row[headers.indexOf('FECHA') + 1];

        const fechaMonth = moment(fech, "DD/MM/YYYY").format("MM");
        
        if(mesHoy == fechaMonth){
            ev = {                        
                id : row[headers.indexOf('ID') + 1] || '',            
                fecha : row[headers.indexOf('FECHA') + 1] || '',
                evento : row[headers.indexOf('EVENTO') + 1] || '',                        
                link : row[headers.indexOf('LINK') + 1] || ''            
            };            
        }

        return ev;
        
    });

    //return menu;
}

module.exports = {getParsedDataAventos}