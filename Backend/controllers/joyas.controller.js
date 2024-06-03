import { joyasModel } from "../models/joyas.model.js";
import { getDatabaseError } from "../lib/errors/database/database.error.js";

const readHATEOAS = async (req, res) => {

  const { limit, order, page} = req.query;

  try {
    const joyas = await joyasModel.findHATEOAS({ limit, order, page });
    return res.json(joyas);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
  return res.status(500).json({ message: "Error del servidor" });
  }
};


const readFilter = async (req, res) => {
  try {
    const queryStrings = req.query
    const joyas = await joyasModel.findJoyasByFilter(queryStrings);
    return res.json(joyas);
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
  return res.status(500).json({ message: "Error del servidor" });
  }
}

const readById = async (req, res) => {
  const id = req.params.id;
  try {
    const joya = await joyasModel.findById(id);
    if (!joya) {
      res.status(404).json({ message: "Joya no encontrada" });
    }
    res.json(joya);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const create = async (req, res) => {
  const { nombre, categoria, metal, precio, stock } = req.body;
  // console.log(queryBody);
  //Validación de campos vacíos
  if (!nombre || !categoria || !metal || !precio || !stock) {
    return res.status(400).json({ message: "Ingrese todos los campos" });
  }
  const nuevaJoya = {
    nombre,
    categoria,
    metal,
    precio,
    stock
  };
  try {
    const joya = await joyasModel.create(nuevaJoya);
    return res.json(joya);
  } catch (error) {
    console.log("Error al crear la joya:",error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// const update = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const joya = await joyasModel.update(id);
//     if (!joya) {
//       return res.status(404).json({ message: "No se encuentra la Joya a actualizar" });
//     }
//     return res.json(joya);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Error del servidor" });
//   }
// };

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const joya = await joyasModel.remove(id);
    if (!joya) {
      return res.status(404).json({ message: "No se encuentra la Joya a eliminar" });
    }
    return res.json({ message: "Joya eliminada correctamente" });
  } catch (error) {
    console.log(error);
    if (error.code) {
      const { code, message } = getDatabaseError(error.code);
      return res.status(code).json({ message });
    }
    return res.status(500).json({ message: "Error del servidor" });
  }
};

export const joyasController = {
  // read,
  readHATEOAS,
  readFilter,
  readById,
  create,
  // update,
  remove,
};
