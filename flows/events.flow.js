const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { getParsedDataAventos } = require("../scripts/events")



const   eventosFlow = addKeyword(EVENTS.ACTION)    

    
    .addAction(async(ctx, ctxFn) => {

        const event = await getParsedDataAventos();

        let men = "";

        event.forEach(e => {
            if(e != null ){            
                men += e.id  + "  " + e.evento + " Fecha: "+ e.fecha +" \n"
            }              
        });

        if(men.length <= 0) {
           men = "Hola 😊, actualmente no tenemos eventos programados para este mes. ¡Pero mantente atento, pronto tendremos novedades!."
        }

        //await ctxFn.endFlow(`Aqui nuestros eventos de este mes. \n${men} \n0. Volver al menú principal` );

        await ctxFn.flowDynamic([
            {
                body:`Aqui nuestros eventos de este mes. \n${men} \n0. Volver al menú principal`,
                media: 'D:/WampNode/CAFETERIA RAYMI/base-baileys-memory/transferencias.jpg',                
                delay: 100
            }
        ]); 

    })
    
/*
    .addAnswer(['Aqui nuestros eventos de este mes.','','0. Volver al menú principal'], {
        
        //media: 'https://drive.google.com/file/d/1EMsn-Iy59tr6zVnDG19XuiLzKnNxVVoO/view',                
        media: 'D:/WampNode/CAFETERIA RAYMI/base-baileys-memory/transferencias.jpg',                
        
    })
    
  */  
module.exports  =  { eventosFlow };