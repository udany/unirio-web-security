async function postData(url, data) {
    // Default options are marked with *
    let result = await fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // *manual, follow, error
    });

    let resultData = await result.json();

    return resultData;
}

async function getData(url) {
    let result = await fetch(url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // *manual, follow, error
    });
    return result.json();
}

window.Session = {
    logged: false,
    user: null
};

async function getAuthStatus() {
    let status = await getData('/auth/status');
    if (status.logged) {
        Session.logged = true;
        Session.user = status.user;
    }
}

getAuthStatus();