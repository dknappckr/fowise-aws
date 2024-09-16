const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());  // Para manejar solicitudes con JSON

// Configuración de la base de datos MySQL en AWS
const dbConfig = {
  host: '35.173.186.196, // IP o nombre de host de tu base de datos
  user: 'dknapp',
  password: 'Dckr1973#$',
  database: 'dptos'
};

// Ruta para consultar edificios disponibles según el presupuesto
app.post('/get-available-buildings', async (req, res) => {
  const { budget } = req.body;

  try {
    // Conectar a la base de datos y ejecutar la consulta
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT building FROM departamentos WHERE rent <= ?', [budget]);

    // Cerrar la conexión y enviar la respuesta
    await connection.end();
    res.json({ success: true, buildings: rows });
  } catch (error) {
    console.error('Error en la consulta SQL:', error.message);
    res.status(500).json({ success: false, message: 'Error en la consulta SQL.' });
  }
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en el puerto ${PORT}`);
});
