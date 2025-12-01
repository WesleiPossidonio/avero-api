import { Router } from 'express'
import passport from "../src/config/passport.js";
import jwt from "jsonwebtoken";
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import BlingController from './app/controllers/BlingController.js'
import OrderController from './app/controllers/OrderController.js';
import OrderItemController from './app/controllers/OrderItemController.js'
import PaymentController from './app/controllers/PaymentController.js';
import AsaasWebhookController from './app/controllers/AsaasWebhookController.js';
import BlingTokenController from './app/controllers/BlingTokenController.js';

const router = new Router();

// rota para iniciar o login com o Google
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// rota callback do Google
router.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user', name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.redirect(`http://localhost:5173/auth/success?token=${token}`);
  }
);

// Rota de Users
router.post("/auth/register", UserController.store)
router.post("/auth/login", SessionController.store)
router.get("/auth/me", UserController.index)

// Rota de produtos
router.get("/produtos", BlingController.index)
router.get("/produtos/:id", BlingController.show)

// Criar pedido
router.post("/orders", OrderController.store);
router.get("/orders/:id", OrderController.show);
router.get("/orders/user/:userId", OrderController.index);

// Criar item para um pedido
router.post("/orders/:orderId/items", (req, res, next) => {
  req.body.order_id = req.params.orderId; // garante que o order_id venha da URL
  next();
}, OrderItemController.store);

router.get("/orders/:orderId/items", OrderItemController.index);
router.put("/order-items/:id", OrderItemController.update);
router.delete("/order-items/:id", OrderItemController.delete);

// Criar pagamento para um pedido
router.post("/:orderId", PaymentController.store);
router.get("/single/:id", PaymentController.show);
router.get("/order/:orderId", PaymentController.listByOrder);
router.patch("/:id/status", PaymentController.updateStatus);
router.get("/order/:orderId", PaymentController.listByOrder);
// rota ASAAS
router.post("/:orderId/charge", PaymentController.createCharge);
router.post("/asaas/webhook", AsaasWebhookController.handle);
router.post("/bling/token", BlingTokenController.store);
export default router;
