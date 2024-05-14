import Stripe from 'stripe';
import dotenv from 'dotenv';
import config from '../config/config.js';
import CartManager from '../services/db/cart.service.js';
import ProductService from '../services/db/product.service.js';

dotenv.config();

const stripe = new Stripe(config.stripe_key);

const createSession = async (req, res) => {
    try {
        const cid = req.body.cid;
        const cartService = new CartManager();
        const productService = new ProductService();

        const resultCart = await cartService.getCartDetails(cid);
        const purchaseCart = resultCart.cart;

        let productsToTicket = [];
        let amount = 0;

        for (const product of purchaseCart.products) {
            const productToBuy = await productService.getProductById(product.product._id);
            if (!productToBuy) {
                continue;
            }

            const quantity = Math.min(product.quantity, productToBuy.stock);
            amount += quantity * productToBuy.price;

            productsToTicket.push({
                description: productToBuy.description,
                title: productToBuy.title,
                price: productToBuy.price,
                quantity: quantity
            });
        }

        if (productsToTicket.length === 0) {
            return res.status(400).json({ status: 'error', error: 'No hay productos en el carrito' });
        }

        const lineItems = productsToTicket.map(prd => ({
            price_data: {
                product_data: {
                    name: prd.title,
                    description: prd.description
                },
                currency: 'usd',
                unit_amount: Math.round(parseInt(prd.price * 1.2) * 100)
            },
            quantity: prd.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: config.environment === 'development' ? `http://${req.hostname}:${config.port}/api/carts/${cid}/purchase` : `http://${req.hostname}/api/carts/${cid}/purchase`,
            cancel_url: config.environment === 'development' ? `http://${req.hostname}:${config.port}/api/payments/cancel` : `http://${req.hostname}/api/payments/cancel`
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};

const failedSession = async (req, res) => {
    res.render('payment/errorPay');
};

export default { createSession, failedSession };
