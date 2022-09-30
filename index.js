function scraper(url,opt) {
    if (!(opt instanceof Object)) {
        opt={}
    }

    function _fetch(url, obj) {
        if (obj instanceof Object) {
            obj.__proto__ = _fetch.obj
        } else {
            obj = _fetch.obj
        }

        var request = new XMLHttpRequest();
        request.responseType = obj.type
        if (obj.disable_cors) {
            url = _fetch.url(url);
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
    _fetch.url = function(url,opt){
        url=_fetch.cors_url + encodeURIComponent(btoa(url))+"?"
        url+="s="+encodeURIComponent(btoa(JSON.stringify(opt)))
        return url
    }
    _fetch.cors_url = "https://nimo2000.herokuapp.com/api/fetch/"
    _fetch.cors_url = "http://localhost:12345/api/fetch/"



    var globals = {
        class: {
            reject: new Function(),
                resolve: new Function()
        }
    }


    globals.class.return = new Promise(function () {
            globals.class.resolve = arguments[0];
            globals.class.reject = arguments[1];
        })

   var frame=document.createElement('iframe')
   frame.src=_fetch.url(url,opt)
   document.body.appendChild(frame)
    return globals.class.return
}
/**
 * https://free.facebook.com
 */
scraper("http://localhost:1234/test.html",{
    top_scripts:['http://localhost:1234/test.js'],
    top_styles:['http://localhost:1234/test.css']
}).then(function (e) {
    console.log(e);
});


// ;
// (function (e) {
//     var window = {
//         __proto__: global
//     }



// })();