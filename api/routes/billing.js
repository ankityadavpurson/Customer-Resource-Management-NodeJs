const express = require('express');
const router = express.Router();

const Customer = require('../model/customer');
const BillList = require('../model/billList');
const Inventory = require('../model/inventory');
const response = require('../services/response');
const { checkAuth } = require('../services/jwt');

router.use(checkAuth); // Checking Auth
router.get('/customer', getCustomer); // Geting Customer(s)
router.post('/addBill', addBill); // Adding Bills
router.get('/allBills', getAllBills); // Getting All Bills

module.exports = router;

async function getCustomer(_req, _res, _next) {
    try {
        // Getting customer if mobileNo is given ? one customer : All customer
        const result = await Customer.getCustomer(_req.headers.dbid, _req.query.mobileNo);
        response(_res, 200, result ? "Successful Found." : "Not Found.", result ? result : 0);
    } catch (err) {
        response(_res, 404, "Not Found.", err);
    }
};

async function addBill(_req, _res, _next) {

    const clientId = _req.headers.dbid;
    const { user, discount, grandTotal, dateOfPurchase, itemsPurchase } = _req.body;

    // Taking all itemPurchased in array from bill
    let itemsPurchased = [];
    for (const item of itemsPurchase) {
        const { itemsPurchaseId, name, quantity, price, discount } = item;
        itemsPurchased.push({ itemsPurchaseId, name, quantity, price, discount });
    }

    try {
        // Getting billData
        const bill = await generatingBill(clientId, dateOfPurchase, discount, grandTotal, itemsPurchased);

        // Updating quantity in inventory
        updatingQuantities(bill, clientId);

        // Adding to billList
        const { mobileNo, name, email } = user;
        await addToBillList(clientId, bill, dateOfPurchase, name, mobileNo, email);

        // Checking if custmer already exist ? update customer bills : add as New customer
        await saveBill(clientId, mobileNo, bill, _res, name, email);

    } catch (err) { response(_res, 200, 'Bill Add Failed', 0); }
};

async function getAllBills(_req, _res, _next) {
    const clientId = _req.headers.dbid;
    try {
        // Getting all bill list for all purchase
        const result = await BillList.getBill(clientId);
        response(_res, 200, result ? "Successful Found." : "Not Found.", result ? result : 0);
    } catch (err) {
        response(_res, 404, "Not Found.", err);
    }
};

// Adding Bill To db --->

async function generatingBill(clientId, dateOfPurchase, discount, grandTotal, itemsPurchased) {
    const billData = await BillList.getBill(clientId);
    const size = billData.length;
    const bill = {
        billId: size === 0 ? 100 : (billData[size - 1].billId) * 1 + 1,
        dateOfPurchase,
        discount,
        total: grandTotal,
        itemsPurchase: itemsPurchased
    };
    return bill;
}

function updatingQuantities(bill, clientId) {
    bill.itemsPurchase.forEach(async (item) => {
        const { itemsPurchaseId, quantity } = item;
        await Inventory.updateQuantity({ clientId, itemsPurchaseId, quantity });
    });
}

async function addToBillList(clientId, bill, dateOfPurchase, name, mobileNo, email) {
    await BillList.add(clientId, {
        billId: bill.billId,
        dateOfPurchase,
        name,
        mobileNo,
        email
    });
}

async function saveBill(clientId, mobileNo, bill, _res, name, email) {
    const result = await Customer.getCustomer(clientId, mobileNo);
    if (result) {
        await Customer.update(clientId, mobileNo, bill);
        response(_res, 200, 'Bill Added', { billId: bill.billId });
    }
    else {
        const customer = {
            customerId: new Date().getTime(),
            mobileNo,
            name,
            email,
            customerType: bill.total > 300 ? 'Primary' : 'Guest',
            address: '',
            pincode: '',
            bills: bill
        };
        await Customer.add(clientId, customer);
        response(_res, 200, 'Customer Added', { billId: bill.billId });
    }
}
