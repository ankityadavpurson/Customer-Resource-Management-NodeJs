const hostname = port => {
    if (process.env.DEV) {
        const ifaces = require('os').networkInterfaces();
        Object.keys(ifaces).forEach(ifname => {
            var alias = 0;
            ifaces[ifname].forEach(iface => {
                if ('IPv4' !== iface.family || iface.internal !== false) return;
                if (alias >= 1) console.log(ifname + ':' + alias, 'at', iface.address + ':' + port);
                else console.log('Running on', ifname, 'at', iface.address + ':' + port);
                ++alias;
            });
        });
    } else {
        console.log('Server Listening.');
    }
}

module.exports = hostname;
