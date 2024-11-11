const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')


const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



// _init_app
const { getParsedDataMenuApp } = require("./scripts/config")

const { menuFlow } = require("./flows/menu.flow");
const { cartaFlow } = require("./flows/carta.flow");
const { locationFlow } = require("./flows/location.flow");
const { hoursFlow } = require("./flows/hours.flow");
const { eventosFlow } = require("./flows/events.flow");


const { welcomeFlow, } = require('./flows/welcome.flow');
const { dateFlow } = require('./flows/date.flow');
const { formFlow } = require('./flows/form.flow');

//const moment = require('moment');
//require('moment/locale/es'); // Importa el idioma español

const moment = require("moment-timezone");


const flowPrincipal = addKeyword(EVENTS.WELCOME)    

    .addAction( async ( ctx, ctxFn ) => {
        const nav = await getParsedDataMenuApp();


        //moment.locale('es');

        // Obtener la fecha y hora actual en la zona horaria de Perú
        const peruTime = moment().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss");

        console.log("hora de peru ", peruTime);


        if( nav != null) {

            const bodyText = ctx.body.toLowerCase();

            // OP 0 = Muestra menu app            
            const keywords = ["0","hola", "buenas", "ola"];
            const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
            if (containsKeyword && ctx.body.length < 8) {
                return await ctxFn.gotoFlow(welcomeFlow);
            } 

            // OP 1 = ver carta
            const keywordsCarta = ["1", "carta", "ver", "uno"];
            const containsKeywordCarta = keywordsCarta.some(keyword => bodyText.includes(keyword));
            if (containsKeywordCarta) {
                nav.forEach(menu => {                    
                    if( menu.id == '1' && menu.estado == 'true') {
                        return ctxFn.gotoFlow(cartaFlow) //Si, quiere ver menu
                    }
                });
            }             


            // OP = 2  inicia reserva ?
            const keywordsDate = ["2","agendar","reservar", "cita", "reserva"];
            const containsKeywordDate = keywordsDate.some(keyword => bodyText.includes(keyword));
            if (containsKeywordDate) {
                nav.forEach(menu => {                    
                    if( menu.id == '2' && menu.estado == 'true') {
                        return ctxFn.gotoFlow(dateFlow) //Si, quiere reservar
                    }
                });

                
            }            

            // OP 3 = ubicaion ?
            const keywordsLocation = ["3","ubicaion","lugar","direccion"];
            const containsKeywordLocation = keywordsLocation.some(keyword => bodyText.includes(keyword));
            if (containsKeywordLocation) {
                nav.forEach(menu => {                    
                    if( menu.id == '3' && menu.estado == 'true') {
                        return ctxFn.gotoFlow(locationFlow) //Si, quiere reservar
                    }
                });                
            }            

            // OP 4 = Horario de atencion ?
            const keywordsHours = ["4","horario,","horario de atencion"];
            const containsKeywordHours = keywordsHours.some(keyword => bodyText.includes(keyword));
            if (containsKeywordHours) {
                nav.forEach(menu => {                    
                    if( menu.id == '4' && menu.estado == 'true') {
                        return ctxFn.gotoFlow(hoursFlow) //Si, quiere reservar
                    }
                });                
            }  
            
            
            // OP 5 = Eventos especiales y catering ?
            const keywordsEventos = ["5","horario,","horario de atencion"];
            const containsKeywordEventos = keywordsEventos.some(keyword => bodyText.includes(keyword));
            if (containsKeywordEventos) {
                nav.forEach(menu => {                    
                    if( menu.id == '5' && menu.estado == 'true') {
                        return ctxFn.gotoFlow(eventosFlow) //Si, quiere reservar
                    }
                });                
            }
            
            
            // OP 6 = Cumpleaños ?
            const keywordsCumpleanos = ["6","cumpleaños,"];
            const containsKeywordCumple = keywordsCumpleanos.some(keyword => bodyText.includes(keyword));
            if (containsKeywordCumple) {
                nav.forEach(menu => {                    
                    if( menu.id == '6' && menu.estado == 'true') {

                        //return ctxFn.gotoFlow(eventosFlow) //Si, quiere reservar
                        return ctxFn.endFlow("Dejanos tu email para recibir promociones")
                    }
                });                
            }
            
        }else{
            
        }

        
    });


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, welcomeFlow, dateFlow, formFlow, cartaFlow, locationFlow, hoursFlow,eventosFlow ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()


