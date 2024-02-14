const express = require('express');
const path = require('path'); // Módulo para trabajar con rutas de archivos
const app = express();
const csv = require('csv-parser');
const port = 1111;
const fs = require('fs');
const bodyParser = require('body-parser');
const { verify } = require('crypto');
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

// Conexion con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1127919765Jf',
  database: 'marvyshopmarket'
});


connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
    
  }

});

function registrarUser(tabla,tipo,dataToAdd,res,connection){
  const sql = `INSERT INTO ${tabla} (${tipo}Usuario,${tipo}Contraseña, ${tipo}Correo) VALUES (?, ?, ?)`;
  const values = [dataToAdd.username, dataToAdd.password, dataToAdd.email];
  
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error al insertar en la base de datos:', error);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log('Registro agregado a la base de datos con éxito');
      res.redirect("/home?registroExitoso=true&nombreUsuario=" + dataToAdd.username);
      return;
    }
  });  
}

function registrarTienda(tabla,tipo,dataToAdd,res,connection){
  const sql = `INSERT INTO ${tabla} (${tipo}Id,${tipo}Nombre,${tipo}Contacto,${tipo}Ubi) VALUES (?, ?, ?, ?)`;
  const values = [dataToAdd.id, dataToAdd.name, dataToAdd.tel, dataToAdd.ubicacion];
  
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error al insertar en la base de datos:', error);
      res.status(500).send('Error interno del servidor');ñ
    } else {
      console.log('Registro agregado a la base de datos con válido');
      return;
    }
  });
};

function verificarCredenciales(usuario, contrasena, tabla_Tendero, dataToAdd, res, connection) {
  const usuario_cliente = dataToAdd.user;
  const password_cliente = dataToAdd.password;

  const usuariosQuery = 'SELECT ' + usuario + ' FROM ' + tabla_Tendero;
  const contrasenaQuery = 'SELECT ' + contrasena + ' FROM ' + tabla_Tendero;

  connection.query(usuariosQuery, (errUsuarios, resultsUsuarios, fieldsUsuarios) => {
    if (errUsuarios) {
      console.error('Error al ejecutar la consulta de usuarios:', errUsuarios);
      return res.redirect('/login?inicioSesion=false');
    } else {
      console.log('Resultados del login: ', usuario_cliente);
      console.log('Resultados de la consulta de usuarios:', resultsUsuarios);

      const existeUsuario = resultsUsuarios.some(
        (item) => item[usuario] === usuario_cliente
      );

      if (existeUsuario) {
        console.log('Usuario correcto');

        connection.query(contrasenaQuery, (errContrasena, resultsContrasena, fieldsContrasena) => {
          if (errContrasena) {
            console.error('Error al ejecutar la consulta de contraseña:', errContrasena);
            return res.redirect('/login?inicioSesion=false');
          } else {
            console.log('Resultados de la consulta de contraseña:', resultsContrasena);
            console.log('Resultado consulta contraseña cliente: ', password_cliente);

            const contrasenaCorrecta = resultsContrasena.some(
              (item) => item[contrasena] === password_cliente
            );

            if (contrasenaCorrecta) {
              console.log('Usuario y contraseña correctos');
              res.redirect('/home?inicioSesion=true&nombreUsuario=' + usuario_cliente);
            } else {
              console.log('Usuario y contraseña incorrectos');
              res.redirect('/login?inicioSesion=false');
            }
          }
        });

      } else {
        console.log('Usuario incorrecto');
        res.redirect('/login?inicioSesion=false');
      }
    }
  });
}



// Configurar el middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Establecer la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Configurar Express para servir archivos estáticos desde la carpeta 'data'
app.use('/data', express.static(path.join(__dirname, 'data')));

// Establecer el motor de vistas (opcional si usas un motor de plantillas como EJS o Pug)
app.set('view engine', 'html');

// Configurar middleware para analizar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para evitar el almacenamiento en caché
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'loading.html'));
});

app.get('/redirigir-login', (req, res) => {
  setTimeout(function() {
    res.redirect("/login");
  }, 5000);
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.post('/procesar-datos', (req,res) => {
   // Obtener el valor del input desde la solicitud
  const user_Name  = req.body.usuario_singUp;
  const user_Password = req.body.password_singUp;
  const user_Correo = req.body.email_singUp;
  const tienda_Nom = req.body.nombre_tienda;
  const tienda_Id = req.body.id_tienda;
  const tienda_Tel = req.body.contacto_tienda;
  const tienda_Ubi = req.body.ubi_tienda;
  
  //organizar los datos en diccionarios
  const dataToAddUser = {
    username: user_Name,
    password: user_Password,
    email: user_Correo
  }
  const dataToAddTienda = {
    name: tienda_Nom,
    id: tienda_Id,
    tel: tienda_Tel,
    ubicacion: tienda_Ubi
  }

  console.log(req.body, dataToAddUser, dataToAddTienda);
  registrarUser("Tendero","ten_",dataToAddUser,res,connection);
  registrarTienda("Tienda","tien_",dataToAddTienda,res,connection)
  
});

app.post('/redirigir-registros', (req, res) => {
  return res.redirect('/registrarse');
});

app.get('/registrarse', (req,res) =>{
  res.sendFile(path.join(__dirname, 'views', 'registro.html'));
})

app.post('/comprobar', (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const dataToVerify = {
    user: user,
    password: password
  }
  console.log(req.body, dataToVerify);
  verificarCredenciales('ten_Usuario', 'ten_Contraseña', 'Tendero', dataToVerify, res, connection);
});


app.get('/home',(req,res) =>{
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/login',(req,res) =>{
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})