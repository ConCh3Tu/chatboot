const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const locationFlow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '¡Hola! Estamos ubicados en: Av. Circunvalación 993 - Juliaca',
        'Maps: : https://maps.app.goo.gl/9LjKvU3VJfogxL4s9',
        '',
        '0. Volver al menú principal'
    ])    

    
    
module.exports  =  { locationFlow };