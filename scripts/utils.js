const { chat } = require('./chatgpt');
const { DateTime } = require('luxon');

/*
* Convierte una fecha en formato ISO a un texto legible.
*/

function  iso2text(iso) {

    try {
        // convierte la fecvha a DateTime de Luxon
        const dateTime = DateTime.fromISO(iso, {zone: 'utc'}).setZone('America/Lima');

        // Formatear la fecha
        const formattedDate = dateTime.toLocaleString( {
            weekday         : 'long',
            day             : '2-digit',
            month           : 'long',
            hour            : '2-digit',
            minute          : '2-digit',
            hour12          : false,
            timeZoneName    : 'short'
        });

        return formattedDate;

    } catch (err) {
        console.error("Error al convertir la fecha" + err);
        return 'Formato de fecha no valido';
    }
    
}


/*
* Convierte una fecha en texto a formato ISO utilizando ChatGPT
*/

// el lunes 9 a las 9am
async function text2iso(text) {


    const currentDate = new Date();

    console.log("text2iso ", currentDate); // 2024-11-11T20:52:38.921Z


    const offsetDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
        .toISOString()
        .replace("Z", "-05:00"); // Reemplaza 'Z' con el desfase de Perú

    console.log("Hora local en formato ISO con UTC-5:", offsetDate); // "2024-11-11T20:58:21.436-05:00"


    const prompt = "La fecha de hoy es: " + currentDate + `Te voy a dar un texto.
        Necesito que de ese texto extraigas la fecha y la hora del texto que te voy a dar y respondas con la misma en formato ISO.
        Me tienes que responder EXCLUSIVAMENTE con esa fecha y horarios en formato ISO, usando el horario 10:00 en caso de que no este especificado la hora.
        Por ejemplo, el texto puede ser algo como "el miercoles 4 de setiembre alas 11am". En ese caso tu respuesta tiene que ser 2024-09-04T11:00:00.000
        Si el texto es algo como: Mañana 10am, sumarle un dia a la fecha actual y dar eso como resultado.
        Si el texto no tiene sentido, responde 'false'`;

        const messages = [{role: "user", content: `${text}`}];

        const response = await chat(prompt, messages);

    return response.trim();  // Asegura que no haya espacios en blanco adicionales   2024-09-09-T9:00:00.00
}




module.exports = { text2iso, iso2text };