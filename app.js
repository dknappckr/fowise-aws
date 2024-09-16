const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json()); // Para manejar solicitudes con JSON
// Configuración de la base de datos MySQL en AWS
const dbConfig = {
host: 'your-db-host.aws.com', // IP o nombre de host de tu base de
datos
user: 'your-db-user',
password: 'your-db-password',
database: 'your-database-name'
};
// 1. Ruta para consultar los edificios disponibles según el
presupuesto
app.post('/get-available-buildings', async (req, res) => {
const { budget } = req.body;
try {
const connection = await mysql.createConnection(dbConfig);
const [rows] = await connection.execute('SELECT * FROM edificios
WHERE arriendo <= ?', [budget]);
await connection.end();
res.json({ success: true, buildings: rows });
} catch (error) {
console.error('Error en la consulta SQL:', error.message);
res.status(500).json({ success: false, message: 'Error en la
consulta de edificios.' });
}
});
// 2. Ruta para consultar las tipologías disponibles en un edificio
app.post('/get-available-typologies', async (req, res) => {
const { building } = req.body;
try {
const connection = await mysql.createConnection(dbConfig);
const [rows] = await connection.execute('SELECT * FROM
tipologias WHERE edificio = ?', [building]);
await connection.end();
res.json({ success: true, typologies: rows });
} catch (error) {
console.error('Error en la consulta SQL:', error.message);
res.status(500).json({ success: false, message: 'Error en la
consulta de tipologías.' });
}
});
// 3. Ruta para consultar la renta mínima para un edificio y
tipología
app.post('/get-lowest-rent', async (req, res) => {
const { building, typology } = req.body;
try {
const connection = await mysql.createConnection(dbConfig);
const [rows] = await connection.execute('SELECT MIN(arriendo) as
renta_minima FROM arriendos WHERE edificio = ? AND tipologia = ?',
[building, typology]);
await connection.end();
res.json({ success: true, lowestRent: rows[0].renta_minima });
} catch (error) {
console.error('Error en la consulta SQL:', error.message);
res.status(500).json({ success: false, message: 'Error en la
consulta de renta mínima.' });
}
});
// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`API corriendo en el puerto ${PORT}`);
});
