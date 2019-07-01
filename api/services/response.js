const response = (res, responseCode, message, data) => {

    if (process.env.DEV) { console.log({ responseCode, message, data }); }

    return res.status(responseCode).json({
        responseCode, message, data
    });

}

module.exports = response;
