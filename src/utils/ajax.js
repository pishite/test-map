function request(uri, params) {
    if ('query' in params) {
        params.body = JSON.stringify(params.query);
        params.headers = {
            'Content-Type': 'application/json'
        };
    }

    console.log('Request', uri, params)
    return fetch('index.php?' + uri, params)
        .then(response => {
            if (response.ok)
                return response.json();

            throw new Error('Invalid response data');
        })
        .catch(response => {
            alert('Send Error. Show more in console');
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
            type: drawInterface.__proto__.constructor.name,
        }
    };

    return request('/draw/remove', params)
}
