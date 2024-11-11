const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { text2iso, iso2text } = require('../scripts/utils');
const { isDateAvaiable, getNextAvaiableSlot } = require("../scripts/calendar");
const { chat } = require("../scripts/chatgpt");

const { formFlow } = require("./form.flow");

const moment = require('moment');
require('moment/locale/es'); // Importa el idioma español

const { getParsedDataSuspenciones } = require("../scripts/suspenciones");

const promptBase = `Eres un asistente virtual diseñado para ayudar a los usuarios a agendar reservas mendiante un conversacioón.
    Tu objetivo es unicamente ayudar al usuario a elegir un horario y una fecha para sacar turno.
    Te voy a dar la fecha solicitada por el usuario y la disponibilidad de la misma. Esta fecha tiene que confirmar el usuario.
    Si la disponibilidad es true, entonces responde algo como: La fecha solicitada esta disponible. El turno seria el Lunes 30 de setiembre 2024 a las 10:00am.
    Si la disponibilidad es false, entonces recomenienda la siguiente fecha disponible que te dejo al final del prompt, suponiendo que la siguiente fechas disponible es el Lunes 30, responde con este formato: La fecha y horario solicitados no estan disponibles, te puedo ofrecer el Lunes 30 de setiembre 2024 a las 11:00am.
    Bajo ninguna circustancias hagas consultas.
    En vez de decir que la disponibilidad es false, envia una disculpa de que esa fecha no esta disponible, y ofrecer la siguiente.
    Te dejo los estados actualizados de dichas fechas`;


const dateFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(["🥳 Para proceder con su reserva por favor, complete los siguientes datos:","Fecha y ⏰ Hora:","👤 Nombre","👥 Cantidad de personas","🎉 ¿Cual es el motivo","🏢 Empresa (si aplica)"]) 
    .addAnswer("📅 Fecha y ⏰ Hora:", { capture: true} )
    .addAnswer("Revisando disponibilidad...", null,
        async (ctx, ctxFn) => {
            
            const currentDate = new Date();
            const solicitedDate = await text2iso(ctx.body);   
            

            console.log("date respuesta GPT ", solicitedDate);
            
            
            if(solicitedDate.includes("false")) {
                return ctxFn.endFlow("No se pudo deducir una fecha. Vuelve a intentar");
            }
            
            const startDate = new Date(solicitedDate);   
            
            console.log("Fecha de inicio startDate ", startDate);

            moment.locale('es');
    
            let fechaSuspencion = moment(solicitedDate).format('DD/MM/YYYY');

            let status = false;

            let datSus = await getParsedDataSuspenciones();
            
            status = datSus.some(item => item.fecha === fechaSuspencion);        
            const eventoData = datSus.find(item => item.fecha === fechaSuspencion);            

            if(!status) {
        
                let dateAvaiable = await isDateAvaiable(startDate);  
                
                //console.log("fecha viable ", dateAvaiable );


                if( dateAvaiable === false ) {
                    const nextdateAvaiable = await getNextAvaiableSlot(startDate);
                    //console.log("Fecha recomendada",nextdateAvaiable.start);
                    const isoString = nextdateAvaiable.start.toISOString();
                    const dateText  = await iso2text(isoString);
                    //console.log("Fecha texto", dateText);

                    const messages  = [{ role: 'user', content: `${ctx.body}` }];
                    const response  = await chat( promptBase + "\nHoy es el dia: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: false. El Proximo espacio disponible posible que tienes que ofrecer es: " +  dateText + "Da la fecha siempre en español", messages);
                    await ctxFn.flowDynamic(response);
                    await ctxFn.state.update({date: nextdateAvaiable.start}) ;
                    //return ctxFn.gotoFlow(confirmationFlow);
                }else{
                    const messages = [{role: "user", content: `${ctx.body}` }];                                
                    const response  = await chat( promptBase + "\nHoy es el dia: " + currentDate + "\nLa fecha solicitada es: " + solicitedDate + "\nLa disponibilidad de esa fecha es: true" + "\nConfirmación del cliente: No confirmo", messages);                                
                    await ctxFn.flowDynamic(response);                
                    await ctxFn.state.update({ date: startDate });

                    //return ctxFn.gotoFlow(confirmationFlow);

                    
                }
            }else{
                return await ctxFn.endFlow("Hola, queremos informarte que " + fechaSuspencion 
                    + " no estaremos atendiendo debido a *"+ eventoData.descripcion 
                    + "* Te invitamos a visitarnos en los días previos o posteriores para atenderte con gusto.")
            }

        }
        
    )
    .addAnswer("Confirmar la fecha propuesta? Responde unicamente con 'si' o 'no'", { capture: true},
        async (ctx, ctxFn) => {

            if(ctx.body.toLowerCase().includes("si")) {
                return ctxFn.gotoFlow(formFlow);
            }else{
                await ctxFn.endFlow("Reserva cancelada. Vuelve a Solicitar una reserva para elegir otra fecha")
            }

        }
    )

/*
const confirmationFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Confirmas la fecha propuesta? Responde unicamente con 'si' o 'no'", { capture: true},
        async (ctx, ctxFn) => {

            if(ctx.body.toLowerCase().includes("si")) {
                return ctxFn.gotoFlow(formFlow);
            }else{
                await ctxFn.endFlow("Reserva cancelada. Vuelve a Solicitar un reserva para elegir otra fecha")
            }
            

        }
    )
*/

module.exports = { dateFlow };

