function request(uri, params) {
    if ('query' in params) {
        params.body = JSON.stringify(params.query);
        params.headers = {
            'Content-Type': 'application/json'
        };
    }

    return fetch('index.php?' + uri, params)
        .then(response => {
            if (response.ok)
                return response.json();

            throw new Error('Invalid response data');
        })
        .catch(response => {
            // alert('Send Error. Show more in console');
            console.log(response)
        });
}

export function drawSave(drawInterface) {
    const params = {
        method: drawInterface.getId() ? 'PUT' : 'POST',
        query: {
            id: drawInterface.getId(),
            type: drawInterface.name,
            coords: drawInterface.getLatLng()
        }
    };

    return request('/draw', params)
}

export function drawRemove(drawInterface) {
    const params = {
        method: 'DELETE',
        query: {
            id: drawInterface.getId(),
            type: drawInterface.name,
        }
    };

    return request('/draw', params)
}

export function drawGet() {
    const params = {
        method: 'GET',
    };

    return request('/draw', params)
}

export function alertGet() {
    const params = {
        method: 'GET'
    };

    return request('/alert', params)
}

export function alertAdd(markers) {
    const params = {
        method: 'POST',
        query: markers
    };

    return request('/alert', params)
}
