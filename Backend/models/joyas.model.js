import "dotenv/config"; //instancia para el uso de variables de entorno
import format from "pg-format"; //paquete pg-format
import { pool } from "../database/connection.js"; //instancia para la conexión de bd
// Creamos una constante con la URL de la aplicación según el entorno
// DOMAIN_URL_APP deberías crearla al momento de desplegar la aplicación
// PORT se debe agregar al archivo .env

const BASE_URL = process.env.NODE_ENV === "production" ? process.env.DOMAIN_URL_APP : `http://localhost:${process.env.PORT}`;

// const getJoyas = async () => {
//   let consulta = "SELECT * FROM inventario";
//   const { rows: inventario } = await pool.query(consulta);
//   return inventario;
// }

const findHATEOAS = async ({ limit = 3, order = "ASC", page = 2 }) => {
  // Consulta para contar el número total de filas en la tabla 'inventario'
  const countRowsQuery = "SELECT COUNT(*) FROM inventario";
  const { rows: countResult } = await pool.query(countRowsQuery);
  
  //obtiene todas las joyas,
  const totalJoyas = parseInt(countResult[0].count);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(totalJoyas / limit);

  const query = "SELECT * FROM inventario ORDER BY stock %s LIMIT %s OFFSET %s";
  const offset = (page - 1) * limit;
  const formattedQuery = format(query, order, limit, offset);
  const { rows } = await pool.query(formattedQuery);

  //PARAMETROS: 1-acumulador 2-Elemento actual del array en cada iteración 3-índice
  // const stockTotal = rows.reduce((stock, joya) => stock += joya.stock, 0);

  console.log('MENSAJE DESDE joyas.model.js');
  const stockTotal = rows.reduce((stock, joya, indice) => {
    
    console.log("STOCK",stock, "\nITEM",indice+1, {joya});
    return stock += joya.stock
  }, 0)
  console.log("STOCK TOTAL: ",stockTotal);


  // ESTRUCTURA HATEOAS.
  // Devuelve un array con los resultados y un enlace a cada uno de ellos
  const results = rows.map((row) => {
    return {
      // ...row, TRAE TODO EL OBJETO
      name: row.nombre,
      href: `${BASE_URL}/joyas/${row.id}`,
    };
  });

  // console.log({results, stockTotal});

  return {
    "Joyas": totalJoyas,
    "Stock Total de Joyas": stockTotal,
    "Cantidad de páginas": totalPages,
    "Página": parseInt(page),
    "Límite": limit,
    results,
    // next: totalPages <= page ? null : `${BASE_URL}/joyas?limit=${limit}&order=${order}&page=${page + 1}`,
    // previous: page <= 1 ? null : `${BASE_URL}/joyas?limit=${limit}&order=${order}&page=${page - 1}`,
  };
};

const findJoyasByFilter = async ({ precio_min, precio_max, categoria, metal }) => {
  let filter = []
  if (precio_min) filter.push(`precio >= ${precio_min}`)
  if (precio_max) filter.push(`precio <= ${precio_max}`)
  if (categoria) filter.push(`categoria = '${categoria}'`)
  if (metal) filter.push(`metal = '${metal}'`)
  let consulta = "SELECT * FROM inventario"
  if (filter.length > 0) {
  filter = filter.join(" AND ")
  consulta += ` WHERE ${filter}`
  }
  const { rows: joyas } = await pool.query(consulta)
  return joyas
}


const findById = async (id) => {
  const query = "SELECT * FROM inventario WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// const create = async (joya) => {
//   const query =
//     "INSERT INTO inventario (nombre, categoria, metal, precio, stock) VALUES ($1, $2) RETURNING *";
//   const values = [joya.title, joya.done];
//   const { rows } = await pool.query(query, values);
//   // console.log(await pool.query(query, values))
//   return rows;
// };

const create = async (joya) => {
  const {nombre, categoria, metal, precio, stock} = joya
  //con pg-format se usa %L para manejar los valores de tipo array
  const query = "INSERT INTO inventario (nombre, categoria, metal, precio, stock) VALUES (%L, %L, %L, %L, %L) RETURNING *";
  const formatedQuery = format(query, nombre, categoria, metal, precio, stock);
  const { rows } = await pool.query(formatedQuery);
  // const query = "INSERT INTO inventario (nombre, categoria, metal, precio, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  // const values = [nombre, categoria, metal, precio, stock]
  // const { rows } = await pool.query(query, values);
  return rows;
};

const remove = async (id) => {
  const query = "DELETE FROM inventario WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// const update = async (id) => {
//   const query =
//     "UPDATE inventario SET done = NOT done WHERE id = $1 RETURNING *";
//   const { rows } = await pool.query(query, [id]);
//   return rows[0];
// };

//Exportar funciones de consultas
export const joyasModel = {
  // getJoyas,
  findHATEOAS,
  findJoyasByFilter,
  findById,
  create,
  remove,
  // update,
};
