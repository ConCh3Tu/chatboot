const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { getParsedDataMenuApp } = require("../scripts/config")

const welcomeFlow = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, ctxFn) => {

        const navApp = await getParsedDataMenuApp();
        let men = "";
        navApp.forEach(m => {
            if( m.estado == "true"){
                men += m.id  + "  " + m.menu + "\n"
            }            
        });

        await ctxFn.endFlow(`¡Hola! Bienvenido a *Raymi Café Respondona*, estamos contentos de tenerte por aquí, por favor elige una de las opciones para poder ayudarte. \n${men} `
        );

    });
    
    
module.exports  =  { welcomeFlow };