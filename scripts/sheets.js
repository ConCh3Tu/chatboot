require("dotenv").config();
const { google, sheets_v4 } = require('googleapis')
const { GaxiosResponse } = require('gaxios');

// Inicializa la librería cliente de Google y configura la autenticación con credenciales de la cuenta de servicio.
const auth = new google.auth.GoogleAuth({
    keyFile: 'google.json',  // Ruta al archivo de clave de tu cuenta de servicio.
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Alcance para la API de Google Sheets.
});

const spreadsheetId = process.env.SPREADSHEEID

// Función asíncrona para escribir datos en una hoja de cálculo de Google.
async function writeToSheet(values, range) {
    const sheets = google.sheets({ version: 'v4', auth }); // Crea una instancia cliente de la API de Sheets.
    const valueInputOption = 'USER_ENTERED'; // Cómo se deben interpretar los datos de entrada.

    //console.log("value", values);
    //console.log("range", range);


    const resource = {
        values
    }; // Los datos que se escribirán.

    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range : range,
            valueInputOption: valueInputOption,
            requestBody: resource
        });
        return res; // Devuelve la respuesta de la API de Sheets.
    } catch (error) {
        console.error('Error sheet', error); // Registra errores.
    }
}

// Función asíncrona para leer datos de una hoja de cálculo de Google.
async function readSheet(sheet) {
    const sheets = google.sheets({ version: 'v4', auth });
    const range = sheet

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        });
        const rows = response.data.values; // Extrae las filas de la respuesta.
        return rows; // Devuelve las filas.
    } catch (error) {
        console.error('Error', error); // Registra errores.
    }
}

module.exports = { writeToSheet, readSheet };