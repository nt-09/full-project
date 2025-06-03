import express from "express";
import controller from "../controllers/userController";
import auth from "../middlewares/auth"

const router = express.Router();

router.post("/register", controller.registerUser);
router.post("/login", controller.authentication); //Tem que ser post para ir por dentro e com isso não ser exposto

router.get("/",auth, controller.listUsers);
router.put("/:id", auth, controller.updateUser);
router.delete("/:id", auth, controller.deleteUser)

export default router;
