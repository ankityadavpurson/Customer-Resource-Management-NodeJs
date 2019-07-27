const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Nexmo = require('nexmo');

const Customer = require('../model/customer');
const BillList = require('../model/billList');
const Inventory = require('../model/inventory');
const response = require('../services/response');
const { checkAuth } = require('../services/jwt');
const mail = require('../services/sendMails');
const moment = require('../services/moment');

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

    } catch (err) {
        console.log(err);
        response(_res, 200, 'Bill Add Failed', 0);
    }
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

    // Send Bill to customer
    // via mail
    await sendMail(clientId, mobileNo, bill);
    // via SMS
    // await sendSMS(mobileNo, name);

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

async function sendSMS(mobileNo, name) {
    const smsAPI = 'http://localhost:8080/sms/send';
    try {
        const res = await fetch(
            smsAPI,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "phone": mobileNo,
                    "message": `Dear ${name}, Thank you for shopping with us.`
                        + `Your valuable feedback will help us in improving the shopping experience.`
                        + `Kindly give us your feedback by clicking on https://forms.gle/2ajCaBUpoxMi9BgV8`
                        + `Have a nice day!`
                        + `Team CRM.`
                })
            });
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function sendMail(clientId, mobileNo, bill) {
    try {
        const custmer = await Customer.getCustomer(clientId, mobileNo);

        const HTML = billTemplate({ bill, custmer });
        const subject = 'Bill "CRM"';
        const text = 'bill crm';

        await mail([custmer.email], subject, text, HTML);
    } catch (err) { console.log('mailing error > ', err); }
}

function billTemplate(body) {
    console.log(body);
    const { NODEMAILER_EMAILID } = process.env;
    const { bill, custmer } = body;
    const { billId, dateOfPurchase, discount, total, itemsPurchase } = bill;
    const { customerId, mobileNo, name } = custmer;
    let itemsRows = '';
    itemsPurchase.forEach((item, index) => {
        itemsRows += `<tr><td>${(index * 1) + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.discount}%</td>
                    <td>${item.price}</td></tr > `;
    });

    return `<div style = "padding: 2%;">
        <div>
            <p><strong>Hi ${name},</strong></p>
            <p><strong>Thank you for shoping with "CRM"</strong></p>
            <p>SMS sent to <strong>${mobileNo}</strong></p>
            <p>Id : ${customerId}</p>
            <p><strong>Bill details : -</strong></p>
        </div>
        <div>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr><td><strong>Bill Number</strong></td> <td>${billId}</td></tr>
                <tr><td><strong>#GSTIN</strong></td> <td>${'29AAFCB7707D1ZQ'}</td></tr>
                <tr><td><strong>Date Of Purchase</strong></td> <td>${moment(dateOfPurchase)}</td></tr>
                <tr><td><strong>Discount</strong></td> <td>${discount}%</td> </tr>
                <tr><td><strong>Total </strong></td> <td>Rs.${total}</td> </tr>
            </table>
            <p><strong>Item List -</strong></p>
            <table border="1" cellspacing="0" cellpadding="5">
                <tr>
                    <td><strong>Items PurchaseId</strong></td>
                    <td><strong>Name</strong></td>
                    <td><strong>Quantity</strong></td>
                    <td><strong>Discount</strong></td>
                    <td><strong>Price</strong></td>
                </tr>
                ${itemsRows}
            </table>
            <p>
                Wanted to take a second and thank you for your shopping.
                There is nothing order from a repeat customer, and
                I con't express how great we are every time.
            </p>
            <p> Give us your feedback by clicking on https://forms.gle/2ajCaBUpoxMi9BgV8</p>
            </br>
            <p>contact us on : <strong>${NODEMAILER_EMAILID}</strong></p>
            <p>
                <strong>Team CRM</strong>, Swamy Vivekananda Rd, Sadanandanagar,
                Byappanahalli, Bengaluru, Karnataka 560038
            </p>
        </div>
    </div > `;
}
