const { Pool } = require("pg");
require('dotenv').config();

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    max: process.env.PG_POOL_MAX,
    idleTimeoutMillis: process.env.PG_POOL_IDLE_TIMEOUT_MILLIS,
    connectionTimeoutMillis: process.env.PG_POOL_CONNECTION_TIMEOUT_MILLIS,
};

const pool = new Pool(config);

// Constantes y Process Argv para Captura de Comandos en la Terminal.
const argumentos = process.argv.slice(2);
const proceso = argumentos[0];
const nombre = argumentos[1];
const rutId = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];
const rutConEli = argumentos[1];

const nuevo = async ({ nombre, rutId, curso, nivel }) => {
    try {
        const client = await pool.connect();
        const SQLQuery = {
            text: "INSERT INTO estudiante (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *",
            values: [nombre, rutId, curso, nivel],
        };
        const res = await client.query(SQLQuery);
        client.release();
        console.log(`Estudiante ${nombre} agregado con exito`);
        console.log(res.rows);
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error(error.message);
        console.error(error.code);
    }
};

const rut = async ({ rutConEli }) => {
    try {
        const client = await pool.connect();
        const SQLQuery = {
            //rowMode: 'array',
            name: 'estudiante',
            text: "SELECT nombre, rut, curso, nivel FROM estudiante WHERE rut = $1",
            values: [rutConEli],
        };
        //console.log('SQLQuery :>> ', SQLQuery);
        const res = await client.query(SQLQuery);
        client.release();
        console.log(res.rows);
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error(error.message);
        console.error(error.code);
    }
};

const consulta = async () => {
    try {
        const client = await pool.connect();
        const SQLQuery = {
            rowMode: 'array',
            name: 'estudiantes',
            text: "SELECT nombre, rut, curso, nivel FROM estudiante",
        };
        //console.log('SQLQuery :>> ', SQLQuery);
        const res = await client.query(SQLQuery);
        client.release();
        console.log(res.rows);
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error(error.message);
        console.error(error.code);
    }
};

const editar = async ({ nombre, rutId, curso, nivel }) => {
    try {
        const client = await pool.connect();
        const SQLQuery = {
            text: "UPDATE estudiante SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE rut = $2 RETURNING *",
            values: [nombre, rutId, curso, nivel],
        };
        //console.log('SQLQuery :>> ', SQLQuery);
        const res = await client.query(SQLQuery);
        client.release();
        console.log(res.rows);
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error(error.message);
        console.error(error.code);
    }
};

const eliminar = async ({ rutConEli }) => {
    try {
        const client = await pool.connect();
        const SQLQuery = {
            text: "DELETE FROM estudiante WHERE rut = $1",
            values: [rutConEli],
        };
        const res = await client.query(SQLQuery);
        client.release();
        console.log(`Registro de estudiante con Rut ${rutConEli} fue eliminado con exito`);
        console.log('Cantidad de Registros Afectados', res.rowCount);
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error(error.message);
        console.error(error.code);
    }
};

// Ingresos, Consultas y Eliminacion de Estudiantes.
const main = async () => {
    const est = {
        nombre, rutId, curso, nivel
    }
    const est1 = {
        rutConEli
    }
    if (proceso == 'nuevo') {
        await nuevo(est);
    }
    else if (proceso == 'rut') {
        await rut(est1);
    }
    else if (proceso == 'consulta') {
        await consulta(est);
    }
    else if (proceso == 'editar') {
        await editar(est);
    }
    else if (proceso == 'eliminar') {
        await eliminar(est1);
    }
    else {
        console.log("no existe");
    };
};

main(); 
