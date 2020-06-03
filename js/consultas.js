function post(url, data) {
    return fetch(url, data)
        .then(function (response) {
            return response.json()
        })
        .then(function (dta) {
            return dta;
        })
        .catch(function (e) {
            return e;
        })
}

function get(data) {
    return fetch(data)
        .then(function (response) {
            return response.json()
        })
        .then(function (dta) {
            return dta;
        })
}