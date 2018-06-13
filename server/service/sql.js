const mysql = require('mysql');

function getPoolParams(customParams) {
    var params = {
        host: 'localhost',
        database: 'query-maker',
        acquireTimeout: 100000,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0,
        debug: process.env.SQL_DEBUG === "true",
        /* Support for BigInteger, BigDecimal */
        supportBigNumbers: true,
        bigNumberStrings: true // Bigs are always returned as String
    };
    Object.keys(customParams).forEach((key) => {
        params[key] = customParams[key];
    });
    return params;
}

const pools = {
    /* mainPool: mysql.createPool(getPoolParams({
        acquireTimeout: 1000,
        connectionLimit: 50,
        user: 'root',
        password: 'xxxxxxxxxxx',
    })), */
    readOnlyPool: mysql.createPool(getPoolParams({
        connectionLimit: 50,
        user: 'query-maker',
        password: 'sELLNV93aTSZUVez'
    }))
};

module.exports = {
    readOnlyQuery: (a, b, c) => {
        pools.readOnlyPool.query(a, b, c);
    }
};

