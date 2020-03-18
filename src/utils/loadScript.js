export function loadScript(url, id, callback) {
    let js;

    if (document.getElementById(id))
        return;

    js = document.createElement('script');
    js.id = id;
    js.onload = function () {
        callback();
    };
    js.src = url;
    document.head.appendChild(js);
}
