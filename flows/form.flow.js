const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { createEvent } = require("../scripts/calendar");

const { writeToSheet, readSheet } = require('../scripts/sheets');

const moment = require('moment');
require('moment/locale/es'); // Importa el idioma español

const formFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(`Exelente! Gracias por confirmar la fecha. Te voy a hacer unas consultas para agendar el turno. \n 👤 Nombre:`, { capture: true},
        async (ctx, ctxFn) => {
            // aqui se guarda los datos en memoria o puede elegir guardar en base de datos u otro.
            await ctxFn.state.update({ nombre: ctx.body }); // Guarda el nombre del usuario en el estado en memoria.
        }
     )
     .addAnswer(`👥 Cantidad de personas:`, { capture: true},
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ cantidad: ctx.body }); // Guarda el motivo en el estado
        }
     )
     .addAnswer(`🎉 ¿Cual es el motivo?`, { capture: true},
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ motivo: ctx.body }); // Guarda el motivo en el estado
        }
     )
     .addAnswer(`🏢 Empresa (si aplica)`, { capture: true}, 
        async (ctx, ctxFn) => {
            await ctxFn.state.update({ empresa: ctx.body }); // Guarda el motivo en el estado
        }
     )
     .addAnswer(`Excelente! su reserva fue registrada:`, null,
        async (ctx, ctxFn) => {

            // recupero numero ws
            let evenFrom = '';            
            let evenpushName ='';            

            evenFrom = ctx.from;            
            evenpushName = ctx.pushName;            


            // Recupero data de memoria 
            const userInfo = await ctxFn.state.getMyState();

            const evenName = userInfo.nombre;
            const evenCant = userInfo.cantidad;
            const evenCompany = userInfo.empresa;
            const evenDesc = userInfo.motivo;
            const evenDate = userInfo.date;
            const evenPush = evenpushName;
            const evenPhone = evenFrom;




            moment.locale('es');
            // Formatea la fecha a "Lunes 11 de noviembre 2024 a las 5:00pm"
            const fechaReseva = moment(evenDate).utcOffset('-05:00').format('dddd D [de] MMMM YYYY [a las] h:mmA');


            const de = await ctxFn.endFlow(`
📅 Fecha y ⏰Hora: ${fechaReseva}
👤 Nombre: ${evenName}
👥 Cantidad de personas: ${evenCant}
🎉 Motivo del festejo: ${evenDesc}
🏢 Empresa (si aplica): ${evenCompany}`);

            const resp = await ctxFn.endFlow("Para confirmar tu reserva me encargare de ponerte a la brevedad en contacto con un asesor Gracias.\n\n0. Volver al menú principal")

            // crea evento en Google Calendar
            const eventId  = await createEvent(evenName, evenCant, evenCompany, evenDesc, evenDate,evenPush,evenPhone,fechaReseva, 1);
            
            // crea registro en Google Sheet Hoja de calculo Pestana HISTORICO
                        
            const response = await readSheet("HISTORIAL!A1:A100");            
            console.log("cont", response.length);
            let rangeCol = response.length + 1;
            let range = "HISTORIAL!A"+rangeCol+":J"+rangeCol;

            let rsp = await writeToSheet([[ rangeCol -1,evenName,fechaReseva,evenCant,evenDesc,evenCompany,evenpushName,evenFrom ]], range  );

            await ctxFn.state.clear() // Limpiamos el estado de la memoria.
        }
     )   
     


module.exports = { formFlow };