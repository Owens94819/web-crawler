function scraper(url,options) {
    if (!(options instanceof Object)) {
        options={}
    }
    options.__proto__={
        parse_javascript:true
    }
    
    function _fetch(url, obj) {
        if (obj instanceof Object) {
            obj.__proto__ = _fetch.obj
        } else {
            obj = _fetch.obj
        }

        var request = new XMLHttpRequest();
        request.responseType = obj.type
        request.url = url
        if (obj.disable_cors) {
            url = _fetch.url(url, obj.query);
        }
        // request.withCredentials=true
        request.open("GET", url, true)


        if (obj.options instanceof Object) {
            if (obj.options.headers instanceof Object) {
                for (var key in obj.options.headers) {
                    request.setRequestHeader("x-" + key, obj.options.headers[key] + "")
                }
            }
            delete obj.options.headers;
            if (obj.options instanceof Object) {
                for (var key in obj.options) {
                    request.setRequestHeader("o-" + key, obj.options[key] + "")
                }
            }
        }

        request.send()

        // console.log(request);
        request.onreadystatechange = function () {
            if (request.readyState === request.HEADERS_RECEIVED) {
                if (obj.disable_cors) {
                    request.url = request.getResponseHeader("X-Url") || url
                } else {
                    request.url = request.responseURL
                }
                // console.log(request);
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
        // options: {},
        // headers:{},
        disable_cors: false
    }
    _fetch.url = function (url, qr) {
        url = _fetch.cors_url + encodeURIComponent(btoa(url))
        if (qr instanceof Object) {
            if (qr.regex instanceof Array) {
                qr.regex[0] = qr.regex[0].toString() //.replace(/\\/img,'\\')
            }
            qr = JSON.stringify(qr).toLowerCase()
            // qr=qr.replace(/[^a-z0-9\{\}\:\,\"\'\[\]\\\/]/img,'')
            // console.log(qr);
            url += "?s=" + encodeURIComponent(btoa(qr))
        }
        return url
    }
    _fetch.isdomain = function (url) {
        return url.search(/^https?:\/\/+[^]*[:.]+\w/) >= 0
    }
    _fetch.joinUrl = function (pr, ch) {
        pr = pr.trim()
        ch = ch.trim()
        return pr.replace(/\/$|$/, ch.replace(/^\/|^/, '/'))
    }
    _fetch.cors_url = "http://localhost:12345/api/fetch/"
    // _fetch.cors_url = "https://nimo2000.herokuapp.com/api/fetch/"
    // _fetch.cors_url = "https://anti-cors.cyclic.app/api/fetch/"
    
    // _fetch("http://localhost:1234/test.js", {
    //     _return_request: true,
    //     disable_cors:true,
    //     type:'text',
    //     options:{
    //         method:'post',
    //         headers:{
    //             name:90
    //         }
    //     },
    //     query:{
    //         top_text:"",
    //         regex:[/\blocation(\.[^\W]+)?(\s?)+=?/img,'__$&']
    //     }
    // }).then(function(e){
    // console.log(e.getAllResponseHeaders());
    // console.log(e.getResponseHeader("X-Url"));
    // console.log(e.response);
    // });
    // 
    // return ;
    function parseURL(url) {
        var loc = {}
        url = url.trim().replace(/\n/img, '').toLowerCase().replace(/\\/img, '/')
        loc.href = url.trim().replace(/\n/img, '').toLowerCase()
        loc.origin = [loc.href.match(/^https?\:[\/\\][\/\\]\w[^\/\\#]+\w/)].toString()
        loc.__path__ = loc.href.replace(loc.origin, '')
        loc.parentpathname = loc.__path__.replace(/#[^]+/, '').trim() || '/'
        loc.protocol = [loc.origin.match(/^https?\:/)].toString()
        loc.host = loc.origin.replace(/^https?\:[\\\/][\\\/]/, '')
        loc.hostname = loc.host.replace(/\:[^]*/, '')
        loc.__hash__ = [loc.__path__.match(/#[^?]+/, '')].toString().substring(1)
        loc.hash = [loc.__path__.match(/#[^]+/, '')].toString()
        loc.qeury = [loc.hash.match(/\?[^]+/, '')].toString()
        var pathparse = loc.parentpathname.split('/')
        loc.parentpathname = []
        for (var i = 0; i < pathparse.length; i++) {
            if (pathparse[i] === "..") {
                loc.parentpathname.pop()
                continue;
            } else if (pathparse[i] === "." || pathparse[i] === "") {
                continue;
            }
            loc.parentpathname.push(pathparse[i])
        }

        loc.pathname = '/' + loc.parentpathname.join('/')
        loc.parentpathname.pop()
        loc.parentpathname = '/' + loc.parentpathname.join('/')
        loc.href = loc.origin + loc.pathname + loc.hash;
        return loc
    }
    parseURL.join = function (par, chd, loc) {
        if (arguments.length === 1) {
            chd = par
        }


        chd = chd.trim().replace(/\\/img, '/')
        if (parseURL.isdomain(chd)) {
            return parseURL(chd)
        }
        if (!(loc instanceof Object)) {
            if (typeof globals === 'object') {
                loc = globals.location
            } else {
                loc = parseURL(par)
            }
        }
        if (chd[0] === "/") {
            loc = loc.origin
        } else {
            loc = loc.origin + loc.parentpathname
        }
        loc = parseURL(loc + '/' + chd)
        return loc
    }
    parseURL.isdomain = function (url) {
        return url.search(/^https?:\/\/+[^]*[:.]+\w/) >= 0
    }

    var globals = {
        class: {
            reject: new Function(),
                xresolve: new Function(),
                resolve: new Function(),
                progress: new Function()
        },
        frame:document.createElement('iframe'),
        pdt: true,
        defaultInjection: ``,
        location: parseURL(url)
    }

    globals.request = _fetch(url, {
        return_request: true,
        disable_cors: globals.pdt
    }).request

    globals.class.promiseobj=new Promise(function () {
        globals.class.resolve = arguments[0];
        globals.class.reject = arguments[1];
    });

    globals.class.return = {}

    globals.class.return.beforethen = function () {
        if (arguments[0] instanceof Function) {
            globals.class.xresolve = arguments[0]
        }
        return globals.class.return
    }

    globals.class.return.progress = function () {
        if (arguments[0] instanceof Function) {
            globals.class.progress = arguments[0]
        }
        return globals.class.return
    }

    globals.class.return.then = function () {
        if (arguments[0] instanceof Function) {
            globals.class.promiseobj.then(arguments[0])
        }
        return globals.class.return
    }

    globals.class.return.catch = function () {
        if (arguments[0] instanceof Function) {
            globals.class.promiseobj.catch(arguments[0])
        }
        return globals.class.return
    }

    globals.render_page = function () {
        globals.progress = 0
        globals.class.progress(globals.progress)

        globals.location = parseURL(globals.request.url)
        url = globals.location.href

        // return
        var _promisedScripts = {}
        var promisedScripts = new Promise(function () {
            _promisedScripts.resolve = arguments[0]
        });

        if (globals.request.response) {
            globals.class.xresolve(globals.request.response)
        }

        if (!globals.frame._ready) {
            globals.frame._ready=true
            document.body.appendChild(globals.frame);
        }

        if (!globals.request.response) {
            globals.class.xresolve(globals.frame.contentDocument)
        }

        // console.log(globals.frame.contentWindow.location);
        globals.frame.contentWindow.Location = parseURL(url)
        globals.frame.contentWindow.eval(globals.defaultInjection)

        if (globals.request.response) {
            globals.frame.contentDocument.replaceChild(globals.request.response.documentElement, globals.frame.contentDocument.documentElement)
        }
        globals.request.abort();
        delete globals.request;

        var scripts = options.parse_javascript?globals.frame.contentDocument.scripts:[]
         globals.window=globals.frame.contentWindow

         globals.window.addEventListener("click", function (e) {
            e.preventDefault()
            if (e.target instanceof globals.window.HTMLAnchorElement) {
                var url =e.target.getAttribute('href')
                // globals.request = _fetch(url, {
                //     return_request: true,
                //     disable_cors: globals.pdt
                // }).request

            }
            return;
        },false)
        
        globals.window.addEventListener("submit", function (e) {
            e.preventDefault()
            return;
        })

        globals.window.addEventListener("change", function (e) {
            e.preventDefault()
            console.log(e);
            return;
        })

        globals.window.document.addEventListener('DOMNodeInserted',function(e){
            if (e.target instanceof globals.window.Element) {
                globals.window.document.querySelectorAll('a:nth-child(1)')
                // console.log(e.nextNode());
            }
})
        globals.window.global = globals.window
        globals.class.resolve(globals.window)

        globals.progress += 1
        globals.class.progress(globals.progress)

        /**
         * @ACT makes frame full window (no parent)
         * @NOTE code would'nt run properties are inreplaceable
         *   globals.window.top=globals.window
         *  globals.window.parent=globals.window
         *  globals.window.frames=globals.window
         */
        
      
          
         
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
                            globals.window.dispatchEvent(ev)
                            if (arguments[0][1]) {
                                arguments[0][1].forEach(function () {
                                    if (typeof globals.window.document[arguments[0]]['on' + ev.type] === "function") {
                                        // globals.window.document[arguments[0]].addEventListener(ev.type, globals.window.document[arguments[0]]['on' + ev.type])
                                    } else if (globals.window.document[arguments[0]].getAttribute('on' + ev.type)) {
                                        globals.window.document[arguments[0]]['on' + ev.type] = new globals.window.Function('var event=arguments[0];' + globals.window.document[arguments[0]].getAttribute('on' + ev.type))
                                        globals.window.document[arguments[0]].addEventListener(ev.type, globals.window.document[arguments[0]]['on' + ev.type])
                                    }
                                    globals.window.document[arguments[0]].dispatchEvent(ev)
                                })
                            } else {
                                globals.window.document.dispatchEvent(ev)
                            }
                        } else {
                            globals.window.dispatchEvent(arguments[0])
                        }
                    });
                });
                scripts = undefined
                _promisedScripts.resolve()
                globals.progress += 4
                globals.class.progress(globals.progress)
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
    globals.request.onload=globals.render_page
    
    function execScript() {
        //danger
        globals.window.eval(arguments[0])
    }

    execScript.event = function (name) {
        var ev = globals.window.document.createEvent("Event");
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
                _fetch(parseURL.join(script.getAttribute('src')).href, {
                    type: "text",
                    disable_cors: globals.pdt,
                    query: {
                        // regex: [/\blocation(\.[^\W]+)?(\s?)+=?/img, '__$&']
                    }
                }).then(function () {
                    if (arguments[0].statusText === 'OK') {
                        r(arguments[0].response)
                    } else {
                        r()
                    }
                    arguments[0].abort()
                }).catch(function () {
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
 * p**n api https://cdn-darknaija.com/wp-content/uploads/
 * http://localhost:1234/test.html
 * https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=dogs
 *                      /search?q=logos&hl=en-NG&gbv=2&biw=1350&bih=663&ie=UTF-8&tbm=isch&ei=n8Q3Y-fBDaWAxc8PwMOMgAs&start=20&sa=N
 *                     /search?q=logos&hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&ei=GcU3Y5ylDPCBxc8P7buLiAo&start=40&sa=N
 */
// https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=A&start=0
// 20+40
// var src= "https://darknaija.com"
var src = "http://localhost:1234/test.html"
// var src= "https://free.facebook.com"
// var src= "https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=cutecats&start=0"

scraper(src,{
    // parse_javascript:false
}).beforethen(function (document) {
    var style = window.document.querySelector('[as="head"]')
    document.head.appendChild(style.content.cloneNode(true))
}).progress(function (e) {
    console.log(e);
}).then(function (window, document) {
    document = window.document
    var ctx=document.querySelector("body>div>table")||document.querySelector("body>div.site>div.site-content>section.content-archive")
    if (ctx) {
        document.body.innerHTML=''
        document.body.appendChild(ctx)
    }
    console.log(document);
});;


// ;
// (function (e) {
//     var window = {
//         __proto__: global
//     }



// })();