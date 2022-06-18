const serverless = require('serverless-http');
const express = require('express');
const axios = require('axios');
const app = express();
const API_URL = 'https://api.mercadolibre.com';


app.use(express.json());


/**
 * Devuelve una lista de items con el mayor gasto posible segun el total del cupon.
 *
 * @param string[]  item_ids
 * @param float     amount
 *
 * @returns JsonResponse
 */
app.post('/coupon/', async (req, res) => {
    let response = {};
    let item_ids = [...new Set(req.body.item_ids ?? [])];
    let amount = req.body.amount ?? 0;


    await axios.get(`${API_URL}/items`, {
            params: {
                attributes: 'id,price',
                ids: item_ids.join(',')
            }
        })
        .then(function (res) {
            let data = res.data.map(item => item.body);


            // Elimina items con precio mayor al amount
            data = data.filter(item => item.price <= amount);


            // Obtiene las combinaciones posibles de los items
            let combinaciones = [];
            data.reduce((a, v) => {
                combinaciones = a.concat(a.map(d => [v].concat(d)));
                return combinaciones;
            }, [
                []
            ]);


            // Obtiene los grupos de combinaciones de items que la suma de precios sea menor o igual al amount
            let cb2 = combinaciones.filter(cb => cb.reduce((acc, cur) => acc + cur.price, 0) <= amount);


            // Obtiene el primer grupo de combinaciones que la suma de precios de los items sea mayor
            let cb_sum = 0;
            let cb_valid = null;

            cb2.forEach((cb, pos) => {
                let sum = cb.reduce((acc, cur) => acc + cur.price, 0);
                if (sum > cb_sum) {
                    cb_sum = sum;
                    cb_valid = pos;
                }
            });

            let item_ids = cb2[cb_valid].map(item => item.id);

            response = {
                item_ids: item_ids,
                total: cb_sum
            };
        })
        .catch(function (err) {
            response = err.response.data;
        });


    return res.status(200).json(response);
});


/**
 * Devuelve una lista de items favoritos.
 *
 * @returns JsonResponse
 */
app.get('/coupon/stats', async (req, res) => {
    let response = {};


    await axios.get(`${API_URL}/sites/MLA/search`, {
            params: {
                category: 'MLA1055',
                limit: 5,
                sort: 'sold_quantity'
            }
        })
        .then(function (res) {
            response = res.data.results;
        })
        .catch(function (err) {
            response = err.response.data;
        });


    return res.status(200).json(response);
});


/**
 * Devuelve una respuesta 404
 *
 * @returns JsonResponse
 */
app.use('*', async (req, res) => {
    return res.status(404).json({
        error: 'Not Found',
    });
});


module.exports.handler = serverless(app);
