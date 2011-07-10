function scraper(url) {
    function _fetch(url, obj) {
        if (obj instanceof Object) {
            obj.__proto__ = _fetch.obj
        } else {
            obj = _fetch.obj
        }

        var request = new XMLHttpRequest();
        request.responseType = obj.type
        if (obj.disable_cors) {
            url = _fetch.cors_url + encodeURIComponent(btoa(url));
        }

        request.open("GET", url, true)
        request.send()

        var prm = new Promise(function (r) {
            request.onload = function () {
                r(request)
            }
            request.onerror = arguments[1]
        });

        if (obj.return_request) {
            prm.request = request
        }
        return prm
    }
    _fetch.obj = {
        type: "document",
        method: "GET",
        disable_cors: false
    }
    _fetch.cors_url = "https://nimo2000.herokuapp.com/api/fetch/"
    _fetch.cors_url = "http://localhost:12345/api/fetch/"

    var globals = {
        request: _fetch(url, {
            return_request: true
        }).request,
        class: {
            reject: new Function(),
                resolve: new Function()
        }
    }


    globals.class.return = new Promise(function () {
            globals.class.resolve = arguments[0];
            globals.class.reject = arguments[1];
        }),


        globals.request.onload = function () {
            var window = {
                document:globals.request.response,
                addEventListener : function(){
                    window.document.addEventListener(arguments[0],arguments[1],arguments[2])
                },
                data: {
                    scripts: globals.request.response.scripts,
                    events:[
                        // new Event('DOMContentLoaded'),
                        new Event('DOMContentLoaded'),
                        new Event('load')
                    ]
                },
            }
            
            window.global=window
            window.top=window
            window.parent=window
            window.self=window
            window.frames=window
            window.__proto__=global
            // window.addEventListener=window.document.addEventListener
            // var document = window.document;
            // var alert = window.alert = new Function()
            // var confirm = window.confirm = new Function()
            // var prompt = window.prompt = new Function()
            execScript.window=window;
            window.data.i = 0;
            (function () {
                if (window.data.i === window.data.scripts.length) {
                    // window.document.dispatchEvent("load")
                    window.data.events.forEach(function() {
                        window.dis
                    });
                    return
                }
                window.data.call = arguments.callee;
                execScript.getString(window.data.scripts[window.data.i]).then(function (__e) {
                    execScript(__e)
                    requestAnimationFrame(window.data.call)
                });
                window.data.i += 1
            })();
        }

    function execScript() {
        // var window =execScript.window;
        // var global=window;
        new Function(`
        var window =arguments[0];
        var global=window;
        var document = window.document;
        var addEventListener=window.addEventListener
        var alert = window.alert = new Function()
        var confirm = window.confirm = new Function()
        var prompt = window.prompt = new Function();
        `+arguments[0])(execScript.window)
    }

    execScript.getString = function(script){
        return new Promise(function (r) {
            if (script.src) {
                /**
                 * @todo disable-cors
                 */
                _fetch(script.src, {
                    type: "text"
                }).then(function () {
                    r(arguments[0].response)
                });
            } else {
                r(script.innerHTML)
            }
        });
    }
    return globals.class.return
}
/**
 * https://free.facebook.com
 */
scraper("http://localhost:1234/test.html").then(function (e) {
    console.log(e);
});


// ;
// (function (e) {
//     var window = {
//         __proto__: global
//     }



// })();