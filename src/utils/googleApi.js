export function googleMapsApi(method, ...args) {
    if (window['google'] && method in window.google.maps)
        return new window.google.maps[method] (...args);
}

export function googleMapsConst(...args) {
    let cnst = window.google.maps;

    args.forEach(arg =>
        cnst = cnst || arg in cnst ? cnst[arg] : null)

    return cnst;
}