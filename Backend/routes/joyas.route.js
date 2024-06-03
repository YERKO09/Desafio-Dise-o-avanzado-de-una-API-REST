import { joyasController } from "../controllers/joyas.controller.js";
import { Router } from "express";
import HandleDataBaseLog from "../middleware/log.js";

const router = Router();
// GET /joyas
router.get("/", HandleDataBaseLog, joyasController.readHATEOAS);
// GET /joyas/filtros
router.get("/filtros", HandleDataBaseLog, joyasController.readFilter);
// GET /joya/:id
router.get("/:id", HandleDataBaseLog, joyasController.readById);
// POST /joyas
router.post("/", HandleDataBaseLog, joyasController.create);
// PUT /joya/:id
// router.put("/:id", HandleDataBaseLog, joyasController.update);
// DELETE /joya/:id
router.delete("/:id", HandleDataBaseLog, joyasController.remove);

export default router;