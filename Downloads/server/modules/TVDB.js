const q = require("q");
const request = require('request');
const $http = require('./$http');

const API = "https://api.thetvdb.com";
const API_KEY = "72FB8B2E308C7EE1";

let token = null;
let tokenDate = null;

const buildHeaders = () => {
    return {
        'Authorization': 'Bearer ' + token,
        'Accept-Language': 'fr,en'
    };
};

const authenticate = () => {
    const defer = q.defer();

    if (token && Date.now() - tokenDate < 1600000 * 12) {
        defer.resolve();
    } else {
        $http.post(API + '/login', {"apikey": API_KEY}).then(res => {
            token = res.token;
            tokenDate = Date.now();
            defer.resolve();
        }).catch(err => {
            console.log("get token error", err);
            defer.reject(err);
        });
    }

    return defer.promise;
};

const doRequest = (route) => {
    const defer = q.defer();

    authenticate().then(() => {
        $http.get(API + route, buildHeaders())
            .then(res => defer.resolve(res.data || res))
            .catch(err => defer.reject(err));
    }).catch(err => defer.reject(err));

    return defer.promise;
};

const search = (term) => {
    return doRequest('/search/series?name=' + encodeURI(term));
};

const getSerieInfo = (id) => {
    return doRequest('/series/' + id);
};

const getSerieEpisodes = (id, page) => {
    return doRequest('/series/' + id + '/episodes');
};

const getSerieEpisodesSummary = (id) => {
    return doRequest('/series/' + id + '/episodes/summary');
};

const getSerieImages = (id) => {
    return doRequest('/series/' + id + '/images');
};

const getSerieActors = (id) => {
    return doRequest('/series/' + id + '/actors');
};

const getEpisodeInfo = (id) => {
    return doRequest('/episodes/' + id);
};

module.exports.search = search;
module.exports.getSerieInfo = getSerieInfo;
module.exports.getSerieEpisodes = getSerieEpisodes;
module.exports.getSerieEpisodesSummary = getSerieEpisodesSummary;
module.exports.getSerieImages = getSerieImages;
module.exports.getSerieActors = getSerieActors;
module.exports.getEpisodeInfo = getEpisodeInfo;

search("fargo").then(res => {
    const fargo = res[0];

    console.log(fargo.seriesName);
    console.log(fargo.overview);

    getSerieEpisodesSummary(fargo.id).then(res => {
        console.log("Saisons: ", res.airedSeasons.length, "Episodes: ", res.airedEpisodes);

        getSerieEpisodes(fargo.id).then(res => {
            for (let e of res) {
                // console.log(e); break;
                console.log("Saison " + e.airedSeason + " Episode " + e.airedEpisodeNumber);
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));



}).catch(err => console.log(err));