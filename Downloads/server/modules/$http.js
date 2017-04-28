const https = require('https');
const querystring = require('querystring');
const url = require('url');
const q = require('q');
const request = require('request');

const doRequest = (data) => {
    const defer = q.defer();

    request(data, function (error, response, body) {
        if (response.statusCode === 200) {
            defer.resolve(body);
        } else {
            defer.reject({error: error, statusCode: response.statusCode, body: body});
        }
    });

    return defer.promise;
};

module.exports.post = (url, data) => {
    return doRequest({
        url: url,
        method: "POST",
        json: true,
        body: data
    });
};

module.exports.get = (url, headers) => {
    const data = {
        url: url,
        method: "GET",
        json: true
    };

    if (headers) {
        data.headers = headers;
    }

    return doRequest(data);
};