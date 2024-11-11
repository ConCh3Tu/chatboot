const { google } = require('googleapis')

const moment = require('moment');
require('moment/locale/es'); // Importa el idioma español
require("moment-timezone");  // Extiende moment con moment-timezone
moment.locale('es');



// Inicia la libreria de Google y configura la autenticacion con credenciales de la cuenta 
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',   // Ruta del archivo de la clave de tu cuenta de servicio Calendar
    scopes: ['https://www.googleapis.com/auth/calendar']  // Alcance para la API de google Calendar
});

const calendar = google.calendar({ version: "v3"});

// Constantes para configurar
const calendarID = '77e893c5c9e44ba2865842c9e9e4aa66d2cb849bd9b045119369562289d47b50@group.calendar.google.com';
const timeZone = 'America/Lima';


const rangeLimit = {
    days: [1,2,3,4,5,6,7], // Lunes a Viernes
    startHour: 11,
    endHour: 20
};

const standarDuration = 1; // Duracion por defecto de las citas (1hora)
const dateLimit = 30;  // Maximo de dias a traer la lista de Next Events


/* ============================================================================================================
*  Crea un evento en el calendario
*  ============================================================================================================
*/ 


//createEvent("oscar",,,,)

async function createEvent(nombre, cantidad, empresa, description, date, contacto, telefono, fechaReseva,duration = standarDuration) {
    
    /*
    console.log("name: ", nombre );  // juan 
    console.log("desc: ", description );    // 2 chicharoones
    console.log("date: ", date );    //  par ael lunes 9 
    console.log("push: ", contacto );    //  par ael lunes 9 
    console.log("phone: ", telefono );    //  par ael lunes 9 
    */
    try {
        // Autentication
        const authClient = await auth.getClient();
        google.options({auth: authClient});

        // Fecha y hora de inicio del evento
        const startDateTime = new Date(date);
        // Fecha y hora de fin del evento
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + duration);

        const event = {
            summary     : "RESERVA A:" + nombre,
            description : "FECHA DE RESERVA: " + fechaReseva +"\nMOTIVO: " + description + "\nCANTIDAD: "+ cantidad + "\nEMPRESA: " + empresa +"\nCONTACTO WS: " + contacto + "\nTELEFONO: " + telefono,
            start       : {
                dateTime: startDateTime.toISOString(),
                timeZone: timeZone
            },
            end         : {
                dateTime: endDateTime.toISOString(),
                timeZone: timeZone
            },
            colorId: '2'    // El ID del color verde en Google Calendar es '11' 
        };

        const response = await calendar.events.insert({
            calendarId: calendarID,
            resource: event,
        });


        // Generar la URL de la invitacion
        const eventId = response.data.id;
        console.log("Evento creado con exito., id: " + eventId );
        return eventId;

    } catch (err) {
        console.error("Hubo un error al crear el evento en el servicio de Calendario");
        throw err;
    }
}


/* ============================================================================================================
*  Lista eventos disponibles
*  ============================================================================================================
*/ 

async function listAvaibleSlots(startDate = new Date(), endDate) {

    try {
        const authClient = await auth.getClient();
        google.options({ auth: authClient });


        // Definir fecha de fin si no se proporciona
        if(!endDate) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + dateLimit);

        }

        const response = await calendar.events.list({
            calendarId  : calendarID,
            timeMin     : startDate.toISOString(),
            timeMax     : endDate.toISOString(),
            timeZone    : timeZone,
            singleEvents: true,
            orderBy: 'startTime' 
        });


        const events = response.data.items;
        const slots = [];
        let currentDate = new Date(startDate);


        // Generar slots disponibles basados en rangeLimit
        while( currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            if(rangeLimit.days.includes(dayOfWeek)) {
                for (let hour = rangeLimit.startHour; hour < rangeLimit.endHour; hour++) {
                    const slotStart = new Date(currentDate);
                    slotStart.setHours(hour, 0, 0, 0);
                    const slotEnd = new Date(slotStart);
                    slotEnd.setHours(hour + standarDuration);
                    
                    const isBusy = events.some(event => {
                        const eventStart = new Date(event.start.dateTime || event.start.date);
                        const eventEnd = new Date(event.end.dateTime || event.end.date);
                        return (slotStart < eventEnd && slotEnd > eventStart);
                    });
                    

                    if(!isBusy) {
                        slots.push({ start : slotStart, end : slotEnd});
                    }
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return slots;


    } catch (err) {
        console.error("Hubo un error al contactar el servicio de Calendar lista" + err);
        throw err;
    }
    
}



/* ============================================================================================================
*  Obtine el proximo slot disponible a partir de la fecha dada.
*  ============================================================================================================
*/ 
async function getNextAvaiableSlot(date) {

    try {
        // Verificar si 'date' es string  en formato ISO
        if(typeof date === "string") {
            // Convertir el string ISO en un objeto Date
            date = new Date(date);
        }else if(!(date instanceof Date) || isNaN(date)) {
            throw new Error("La fecha ingresada no es valida");
        }

        // Obtener el proximo slot disponible
        const availableSlot = await listAvaibleSlots(date);

        // Filtrar slots disponibles que comienzan despues de la fecha proporcionada
        const filteredSlots = availableSlot.filter(slot => new Date(slot.start) > date);

        // Ordenar los slots por su hora de inicio en orden ascendente
        const sortedSlots = filteredSlots.sort( (a,b) => new Date(a.start) - new Date(b.start));

        // Tomar el primer slot de la lista resultante, que sera el proximo slot disponible mas cercano
        return sortedSlots.length > 0 ? sortedSlots[0] : null;

    } catch (err) {
        console.error("Hubo un error al contactar el servicio de Calendar slot" + err);
        throw err;       
    }
    
}



/* ============================================================================================================
*  Verifica si  hay slots disponibles para una fecha dada.
*  ============================================================================================================
*/ 
async function isDateAvaiable(date) {
    
    console.log("****************************************************************************")
    

    

    try {

        // Validar que la fecha este dentro del rango permitido
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setDate(currentDate.getDate() + dateLimit);

        console.log("isDateAvaiable  == startDate", date); // 2024-11-11T18:00:00.000
        console.log("currentDate", currentDate);           // 2024-11-11T21:57:33.518Z
        console.log("maxDate", maxDate);                   // 2024-12-11T21:57:33.518Z
        console.error("****************************************************************************");
        console.log("****************************************************************************");

        /*
        if(date < currentDate || date > maxDate) {
            return false; // La fecha esta fuera del rango permitido
        }
        */


        const fecha =  moment(date).format();

        let fechaActual = moment.tz(currentDate,timeZone);
        let fechaMaxima = moment(fechaActual).add(dateLimit, 'days');

        console.log("fecha == startDate", fecha);       // 2024-11-11T18:00:00+00:00
        console.log("fecha Actual", fechaActual);       // 2024-11-11T17:26:27-05:00
        console.log("Fecha Maxima", fechaMaxima);       // 2024-11-12T17:26:27-05:00
        
        if(fecha < fechaActual.format() || date > fechaMaxima.format()) {
            return false; // La fecha esta fuera del rango permitido
        }
        


        // Verificar que la fecha caiga en un dia permitido
        const dayOfWeek = date.getDay();
        if(!rangeLimit.days.includes(dayOfWeek)) {
            return false; // La fecha no esta dentro de los dias permitidos
        }

        // Verificar si la hora este dentro del rango permitido
        const hour = date.getHours();
        if(hour < rangeLimit.startHour || hour >= rangeLimit.endHour) {
            return false; // La hora no esta dentro del rango permitido
        }

        // Obtener todos los slots disponibles desde la fecha actual hasta el liminte definido
        const availableSlots = await listAvaibleSlots(currentDate);

        // Filtrar slots disponibles basados en la fecha dada
        const slotsOnGivenDate = availableSlots.filter(slot => new Date(slot.start).toDateString() ===  date.toDateString());

        // Verificar si hay slots disponibles en la fecha dada.
        const isSlotAvaiable = slotsOnGivenDate.some( slot => 
            new Date(slot.start).getTime() === date.getTime() &&
            new Date(slot.end).getTime() === date.getTime() + standarDuration * 60 * 60 * 1000
        );

        return isSlotAvaiable;


    } catch (err) {
        console.error("Hubo un error al contactar el servicio de Calendar slot aviable" + err);
        throw err;               
    }
    
}


module.exports = { createEvent, isDateAvaiable, getNextAvaiableSlot };
