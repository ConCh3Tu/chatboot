const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { getParsedDataMenu } = require("../scripts/utilsSheets");

    const menuFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("¡Claro! Aquí tienes nuestro menú:", null,
        async (ctx, ctxFn) => {

            const data = await getParsedDataMenu();
            
            const fechaHoy = new Date();
            const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
            const numeroDiaSemana = fechaHoy.getDay();
            const nombreDiaSemana = diasSemana[numeroDiaSemana];

            let ds = '';
            data.forEach(men => {                
                if( men.dia === nombreDiaSemana  ) {
                    let menu = '';    
                    
                    // Filtrar los valores que no sean null y unirlos en un string separado por comas
                    const resultado = Object.values(men.op)
                    .filter(value => value !== null)
                    .join(', ');
                    //const resultado = Object.values(men.op).join(', ');



                    menu += '*'+men.menu + '*: ' + resultado;

                
                    //console.log("==> ", menu);
                    ds += menu + '\n';
                }                
                
                
            });

            
            await ctxFn.flowDynamic(ds + '\n ¿Te gustaría reservar una mesa? \n carta: https://www.canva.com/design/DAGOCkCW4xE/13VsaRgR73WZs7WUmTmY3A/edit' );
            //console.log("menusaa ",  ds );

        }
    )

module.exports = { menuFlow }