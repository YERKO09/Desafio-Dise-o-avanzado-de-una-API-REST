const HandleDataBaseLog = (req, res, next) => {
  const time = new Date();
  const method = req.method;
  const url = req.url;
  const queries = req.query;
  const params = req.params;

  console.log(
    `
    MENSAJE DESDE midlleware/log.js
    
    Hola Admin el día ${time} hizo la siguiente petición al servidor:
    
    METHOD: ${method}
    URL: http://localhost:3000/joyas${url}
    QUERIES: ${Object.entries(queries)} 
    PARAMS: ${Object.entries(params)}

    ----------------------------------------------------------------------
    ` );
  
    next();
}


export default HandleDataBaseLog;