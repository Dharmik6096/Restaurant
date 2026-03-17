import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import menuRouter from "./menu.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import userRouter from "./user.js";
import contactRouter from "./contact.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(userRouter);
router.use(contactRouter);

export default router;
