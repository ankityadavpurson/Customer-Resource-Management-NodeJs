module.exports = (response, responseCode, responseMessage, responseData) => {

    if (process.env.DEV) { console.log({ responseCode, responseMessage, responseData }); }

    return response.status(responseCode).json({
        code: responseCode,
        message: responseMessage,
        data: responseData
    });

};
