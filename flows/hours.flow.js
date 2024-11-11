const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const hoursFlow = addKeyword(EVENTS.ACTION)

    .addAnswer([
        '🕑 Hola nuestros horario de atención son:',
        '   Lunes:  11a.m. a 3a.m.',
        '   Martes: 11a.m. a 3a.m.',
        '   Miércoles: 11a.m. a 3a.m.',
        '   Jueves: 11a.m. a 3a.m. ',
        '   Viernes: 11a.m. a 3a.m. ',
        '   Sábado: 10a.m. a 3a.m.',
        '   Domingo: 10a.m. a 2a.m.`',
        '',
        '0. Volver al menú principal',
    ])    



module.exports  =  { hoursFlow };