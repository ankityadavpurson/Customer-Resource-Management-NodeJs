const express = require('express');
const router = express.Router();

const response = require('../services/response');
const { checkAuth } = require('../services/jwt');
const Customer = require('../model/customer');
const BillList = require('../model/billList');

router.get('/customer', checkAuth, (_req, _res, _next) => {
    Customer.getCustomer(_req.headers.dbid, _req.query.mobileNo)
        .then(result =>
            response(
                _res, 200,
                result ? "Successful Found." : "Not Found.",
                result ? result : 0
            )
        )
        .catch(err => response(_res, 404, "Not Found.", err));
});

router.post('/addBill', checkAuth, (_req, _res, _next) => {

    const { user, discount, grandTotal, dateOfPurchase, itemsPurchase } = _req.body;

    let itemsPurchased = [];
    for (const item of itemsPurchase) {
        const { itemsPurchaseId, name, quantity, price, discount } = item;
        itemsPurchased.push({ itemsPurchaseId, name, quantity, price, discount });
    }

    const { mobileNo, name, email } = user;

    BillList.getBill(_req.headers.dbid)
        .then(billData => {

            const size = billData.length;

            const bill = {
                billId: size === 0 ? 100 : (billData[size - 1].billId) * 1 + 1,
                dateOfPurchase,
                discount,
                total: grandTotal,
                itemsPurchase: itemsPurchased
            };

            BillList.add(_req.headers.dbid, { billId: bill.billId, dateOfPurchase, name, mobileNo, email })
                .then(data => console.log(data))
                .catch(err => console.log(err));

            Customer.getCustomer(_req.headers.dbid, mobileNo)
                .then(result => {
                    if (result) {

                        Customer.update(_req.headers.dbid, mobileNo, bill)
                            .then(data => response(_res, 200, 'Bill Added', { billId: bill.billId }))
                            .catch(err => response(_res, 200, 'Bill Add Failed', 0));

                    } else {

                        const customer = {
                            customerId: new Date().getTime(),
                            mobileNo, name, email,
                            customerType: bill.total > 300 ? 'Primary' : 'Guest',
                            address: '',
                            pincode: '',
                            bills: bill
                        };

                        Customer.add(_req.headers.dbid, customer)
                            .then(data => response(_res, 200, 'Customer Added', { billId: bill.billId }))
                            .catch(err => response(_res, 200, 'Customer Add Failed', 0));
                    }
                })
                .catch(err => response(_res, 200, 'BIll Add Failed', 0));
        })
        .catch(err => response(_res, 200, 'Bill Add Failed', 0));
});

router.get('/allBills', checkAuth, (_req, _res, _next) => {
    BillList.getBill(_req.headers.dbid)
        .then(result =>
            response(
                _res, 200,
                result ? "Successful Found." : "Not Found.",
                result ? result : 0
            ))
        .catch(err => response(_res, 404, "Not Found.", err));
});

module.exports = router;
