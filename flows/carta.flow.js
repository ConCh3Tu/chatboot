const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const   cartaFlow = addKeyword(EVENTS.ACTION)        

    .addAnswer('Carta', {
        media: 'https://drive.google.com/file/d/1r1xJiYltPBMw2S7MY0pM6zSeXVr0vTvH/view',                
         //https://amitel.com.pe/amitelftp/2024/octubre/C0001637.pdf
        //media: './CARTA_RESPONDONA.pdf',                        
    })
    .addAnswer(['Aqui nuestra carta.','2. Para iniciar una reserva','0. Volver al menú principal'])    

    
module.exports  =  { cartaFlow };


