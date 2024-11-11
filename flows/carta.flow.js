const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')


const   cartaFlow = addKeyword(EVENTS.ACTION)        

    .addAnswer('Carta', {
        body: "carta",        
        media: 'D:/WampNode/CAFETERIA RAYMI/base-baileys-memory/CARTA_RESPONDONA.pdf',                
        delay: 100        
    })
    .addAnswer(['Aqui nuestra carta.','2. Para iniciar una reserva','0. Volver al menú principal'])    

    
module.exports  =  { cartaFlow };