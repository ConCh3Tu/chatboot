const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const   cartaFlow = addKeyword(EVENTS.ACTION)        

    .addAnswer('Carta', {
        media: 'https://conch3tu.github.io/CARTA_RESPONDONA.pdf',        
        //media: './CARTA_RESPONDONA.pdf',                        
    })
    .addAnswer(['2. Para iniciar una reserva','0. Volver al menú principal'])    

    
module.exports  =  { cartaFlow };


