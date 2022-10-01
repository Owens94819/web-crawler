function scraper(url) {
    function _fetch(url, obj) {
        if (obj instanceof Object) {
            obj.__proto__ = _fetch.obj
        } else {
            obj = _fetch.obj
        }

        var request = new XMLHttpRequest();
        request.responseType = obj.type
        request.url=url

        if (obj.disable_cors) {
            url = _fetch.url(url,obj.query);
        }
// request.withCredentials=true
        request.open("GET", url, true)
        request.send()

// console.log(request);
request.onreadystatechange = function(){
if (request.readyState===request.HEADERS_RECEIVED) {
    if (obj.disable_cors) {
        request.url=request.getResponseHeader("X-Url")||url
    }else{
        request.url=request.responseURL
    }
    console.log(request);
}
}
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
    _fetch.url = function (url,qr) {
        url=_fetch.cors_url + encodeURIComponent(btoa(url))
        if (qr instanceof Object) {
            if (qr.regex instanceof Array) {
                qr.regex[0]=qr.regex[0].toString()//.replace(/\\/img,'\\')
            }
            qr=JSON.stringify(qr).toLowerCase()
            // qr=qr.replace(/[^a-z0-9\{\}\:\,\"\'\[\]\\\/]/img,'')
            // console.log(qr);
            url+="?s="+encodeURIComponent(btoa(qr))
        }
        return url
    }
    _fetch.isdomain = function(url){
        return url.search(/^https?:\/\/+[^]*[:.]+\w/)>=0
    }
    _fetch.joinUrl = function(pr,ch){
        pr=pr.trim()
        ch=ch.trim()
        return pr.replace(/\/$|$/,ch.replace(/^\/|^/,'/'))
    }
    _fetch.cors_url = "https://nimo2000.herokuapp.com/api/fetch/"
    _fetch.cors_url = "http://localhost:12345/api/fetch/"
    // _fetch("http://localhost:1234/test.js", {
    //     _return_request: true,
    //     disable_cors:true,
    //     type:'text',
    //     query:{
    //         top_text:"",
    //         regex:[/\blocation(\.[^\W]+)?(\s?)+=?/img,'__$&']
    //     }
    // }).then(function(e){
    // console.log(e.getAllResponseHeaders());
    // console.log(e.getResponseHeader("X-Url"));

    // });

    // return 
function parseURL(url) {
    var loc={}
url=url.trim().replace(/\n/img,'').toLowerCase().replace(/\\/img,'/')
loc.href=url.trim().replace(/\n/img,'').toLowerCase()
loc.origin=[loc.href.match(/^https?\:[\/\\][\/\\]\w[^\/\\#]+\w/)].toString()
loc.__path__=loc.href.replace(loc.origin,'')
loc.parentpathname=loc.__path__.replace(/#[^]+/,'').trim()||'/'
loc.protocol=[loc.origin.match(/^https?\:/)].toString()
loc.host=loc.origin.replace(/^https?\:[\\\/][\\\/]/,'')
loc.hostname=loc.host.replace(/\:[^]*/,'')
loc.__hash__=[loc.__path__.match(/#[^?]+/,'')].toString().substring(1)
loc.hash=[loc.__path__.match(/#[^]+/,'')].toString()
loc.qeury=[loc.hash.match(/\?[^]+/,'')].toString()
var pathparse=loc.parentpathname.split('/')
loc.parentpathname=[]
for (var i = 0; i < pathparse.length; i++) {
    if (pathparse[i]==="..") {
        loc.parentpathname.pop()
        continue;
    }else if(pathparse[i]==="."||pathparse[i]===""){
     continue;
    }
    loc.parentpathname.push(pathparse[i])
}

loc.pathname='/'+loc.parentpathname.join('/')
loc.parentpathname.pop()
loc.parentpathname='/'+loc.parentpathname.join('/')
loc.href=loc.origin+loc.pathname+loc.hash;
return loc
}
parseURL.join = function(par,chd,loc){
     if(arguments.length===1){
    chd=par
    }

    
    chd=chd.trim().replace(/\\/img,'/')
    if (parseURL.isdomain(chd)) {
        return parseURL(chd)
    }
    if (!(loc instanceof Object)) {
        if (typeof globals === 'object') {
            loc=globals.location
        }else{
            loc=parseURL(par)
        }
    }
    if (chd[0]==="/") {
        loc=loc.origin
    }else{
        loc=loc.origin+loc.parentpathname
    }
    loc=parseURL(loc+'/'+chd)
    return loc
}
parseURL.isdomain = function(url){
    return url.search(/^https?:\/\/+[^]*[:.]+\w/)>=0
}

    var globals = {
        class: {
            reject: new Function(),
                resolve: new Function()
        },
        pdt:true,
        defaultInjection:``,
        location:parseURL(url)
    }
    globals.request= _fetch(url, {
        return_request: true,
        disable_cors:globals.pdt
    }).request

    globals.class.return = new Promise(function () {
        globals.class.resolve = arguments[0];
        globals.class.reject = arguments[1];
    }),
    

    globals.request.onload = function () {
        
        globals.location=parseURL(globals.request.url)
        url=globals.location.href
        
            // return
            var _promisedScripts = {}
            var promisedScripts = new Promise(function () {
                _promisedScripts.resolve = arguments[0]
            });

            promisedScripts.then(function () {
                // console.log("now create frame");
            });

            var frame = document.createElement('iframe')
            // frame.src = "http://localhost:12345/api/fetch/aHR0cHM6Ly9mcmVlLmZhY2Vib29rLmNvbS8%2FX3JkYz0xJl9yZHI%3D";
            // frame.src = "test.html";
            // frame.width = 0;
            // frame.height = 0;
            // frame.style.display = 'none';
            //frame.addEventListener("load", function (e) {
                // _promisedScripts.resolve()
          //  })
            document.body.appendChild(frame);
            // console.log(frame.contentWindow.location);
            frame.contentWindow.__location=parseURL(url)
            frame.contentWindow.eval(globals.defaultInjection)
            if (globals.request.response) {
                frame.contentDocument.replaceChild(globals.request.response.documentElement, frame.contentDocument.documentElement)
            }
            globals.request.abort();
            delete globals.request;
            
            var scripts = frame.contentDocument.scripts
            var window = frame.contentWindow
            
            window.global = window
            execScript.window = window;
            globals.class.resolve(window)

            /**
             * @act makes frame full window (no parent)
             *   window.top=window
             *  window.parent=window
             *  window.frames=window
             */
            
            
            // window.self=window
            
            // window.addEventListener=window.document.addEventListener
            // window.document;
            // window.alert = new Function()
            // window.confirm = new Function()
            // window.prompt = new Function()
            
            var events = [
                execScript.event("beforeunload"),
                [execScript.event('beforeunload'), ['body']],
                [execScript.event("DOMContentLoaded")],
                [execScript.event("readstatechange")],
                execScript.event('load'),
                [execScript.event('load'), ['body']]
            ]

            var i = 0;
            var call;
            (call = function () {
                if (i === scripts.length) {
                    promisedScripts.then(function () {
                        events.forEach(function () {
                            if (arguments[0] instanceof Array) {
                                var ev = arguments[0][0];
                                window.dispatchEvent(ev)
                                if (arguments[0][1]) {
                                    arguments[0][1].forEach(function () {
                                        if (typeof window.document[arguments[0]]['on' + ev.type] === "function") {
                                            // window.document[arguments[0]].addEventListener(ev.type, window.document[arguments[0]]['on' + ev.type])
                                        } else if (window.document[arguments[0]].getAttribute('on' + ev.type)) {
                                            window.document[arguments[0]]['on' + ev.type] = new execScript.window.Function('var event=arguments[0];' + window.document[arguments[0]].getAttribute('on' + ev.type))
                                            window.document[arguments[0]].addEventListener(ev.type, window.document[arguments[0]]['on' + ev.type])
                                        }
                                        window.document[arguments[0]].dispatchEvent(ev)
                                    })
                                }else{
                                window.document.dispatchEvent(ev)
                                }
                            } else {
                                window.dispatchEvent(arguments[0])
                            }
                        });
                    });
                    scripts = undefined
                    _promisedScripts.resolve()
                    return
                }
                execScript.getString(scripts[i]).then(function (__e) {
                    if (__e) {
                        promisedScripts.then(function () {
                            execScript(__e)
                        });
                    }
                    requestAnimationFrame(call)
                });
                i += 1
            })();
        }

    function execScript() {
       //danger
            execScript.window.eval(arguments[0])
    }
    execScript.event = function (name) {
        var ev = execScript.window.document.createEvent("Event");
        ev.initEvent(name, true, true)
        // var ev = new Event(name,{bubbles: true,cancelable:true,target:{}})
        return ev
    }
    execScript.getString = function (script) {
        return new Promise(function (r) {
            if (script.src) {
                /**
                 * @todo disable-cors
                 */
                // console.log(globals.location,url);
                _fetch(parseURL.join(script.getAttribute('src')).href, {
                    type: "text",
                    disable_cors:globals.pdt,
                    query:{
                        regex:[/\blocation(\.[^\W]+)?(\s?)+=?/img,'__$&']
                    }
                }).then(function () {
                    if (arguments[0].statusText==='OK') {
                        r(arguments[0].response)
                    }else{
                        r()
                    }
                    arguments[0].abort()
                }).catch(function(){
                    r()
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
 * https://google.com
 * http://localhost:1234/test.html
 */
scraper("https://www.google.com.ng/search?hl=en-NG&gbv=2&tbm=isch&q=cats&chips=q:hhh,g_1:steph&sa=X&ved=0ahUKEwjx_uqikr76AhVDX_EDHUwnAq8Q4lYIDCgB").then(function (window) {
    var document=window.document;
    console.log(window);
});


// ;
// (function (e) {
//     var window = {
//         __proto__: global
//     }



// })();