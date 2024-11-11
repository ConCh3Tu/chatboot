const { writeToSheet, readSheet } = require('./sheets');

const slot = {
    dia: "", // String que representa el día
    inicio: "", // String que representa la hora de inicio
    final: "", // String que representa la hora de finalización
    mesas: {}, // Objeto con claves de mesas y valores string o null
    completo: false // Booleano que indica si todas las mesas están ocupadas
};


// Función para obtener y parsear los datos desde Google Sheets
async function getParsedData() {

    const data = await readSheet("Sheet1!A1:J35");

    if (!data) {
        throw new Error('No se pudieron leer los datos de Google Sheets.');
    }

    // Encuentra la fila de encabezado dinámicamente
    const headerRow = data.find(row => row.includes('Día'));

    if (!headerRow) {
        throw new Error('No se encontró la fila de encabezado.');
    }

    const headerIndex = data.indexOf(headerRow);
    const headers = headerRow.slice(1); // Ignora el primer elemento vacío

    // Extrae los datos a partir de la fila de encabezado
    const rows = data.slice(headerIndex + 1);

    return rows.map(row => {
        const slot = {
            dia: row[headers.indexOf('Día') + 1] || '',
            inicio: row[headers.indexOf('Slot Inicio') + 1] || '',
            final: row[headers.indexOf('Slot Final') + 1] || '',
            mesas: {},
            completo: false,
        };

        // Rellenar las mesas dinámicamente
        headers.forEach((header, index) => {
            if (header.startsWith('Mesa')) {
                slot.mesas[header] = row[index + 1] || null;
            }
        });

        slot.completo = Object.values(slot.mesas).every(m => m !== null);

        return slot;
    });
}

// Función para verificar si hay mesas disponibles en una fecha y hora específicas
async function dateAvailable(startDate) {
    try {
        const slots = await getParsedData();

        // Extraer día de la semana y hora de inicio de la fecha proporcionada en UTC
        const daysOfWeek = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
        const dayOfWeek = daysOfWeek[startDate.getUTCDay()];
        const startTime = startDate.toISOString().split('T')[1].slice(0, 5); // Formato 'HH:MM' en UTC

        // Encontrar el slot correspondiente
        const slot = slots.find(s => s.dia === dayOfWeek && s.inicio === startTime);

        if (slot) {
            // Verificar si hay alguna mesa disponible
            const algunaMesaDisponible = Object.values(slot.mesas).some(m => m === null);
            return algunaMesaDisponible;
        }

        return false; // No se encontró un slot disponible

    } catch (error) {
        console.error('Error en dateAvailable:', error);
        return false; // Manejar el error y retornar false indicando que hubo un problema
    }
}



const men = {            
    dia : '',            
    menu : '',            
    op: {},
    estado: false,
    
};

// Función para obtener y parsear los datos desde Google Sheets MENU
async function getParsedDataMenu() {

    const menu = await readSheet("menu!A1:J35");

    if (!menu) {
        throw new Error('No se pudieron leer los menu de Google Sheets.');
    }

    // Encuentra la fila de encabezado dinámicamente
    const headerRow = menu.find(row => row.includes('DIA'));

    if (!headerRow) {
        throw new Error('No se encontró la fila de encabezado.');
    }

    const headerIndex = menu.indexOf(headerRow);
    const headers = headerRow.slice(1); // Ignora el primer elemento vacío

    // Extrae los datos a partir de la fila de encabezado
    const rows = menu.slice(headerIndex + 1);

    return rows.map((row, index) => {
          
         
        const men = {            
            
            dia : row[headers.indexOf('DIA') + 1] || '',            
            menu : row[headers.indexOf('CARTA') + 1] || '',            
            op: {},
            estado: false            
        };
        
        men.dia[index] = row[headers.indexOf('CARTA') + 1] || null;             
        men.menu[index] = row[headers.indexOf('CARTA') + 1] || null;             



        // Rellenar las OP dinámicamente
        headers.forEach((header, index) => {            

            if (header.startsWith('OP')) {
                
                men.op[header] = row[index + 1] || null;             
            }
            
        });
        

        men.estado = Object.values(men.op).every(m => m !== null);

        return men;
    });

    return menu;
}



async function addHistori(date, name) {

    try {
        
        const slots =  await getDataH();

        

    } catch (e) {
        
    }
    
}







module.exports = {getParsedDataMenu, getParsedData, dateAvailable }