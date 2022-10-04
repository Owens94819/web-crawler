function scraper(url, options) {
    if (!(options instanceof Object)) {
        options = {}
    }
    options.__proto__ = {
        parse_javascript: true
    }

    function _fetch(url, obj) {
        if (obj instanceof Object) {
            obj.__proto__ = _fetch.obj
        } else {
            obj = _fetch.obj
        }

        var request = new globals.XMLHttpRequest();
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
        // request.addEventListener("load",function(e){
        //     console.log("loaded");
        // })
        // request.addEventListener("progress",function(e){
        //     console.log("pending",e.total,e.loaded);
        // })
        // return
        request.addEventListener("readystatechange", function (e) {
            // console.log(request.readyState,request);
            //4
            if (request.readyState === request.HEADERS_RECEIVED) {
                if (obj.disable_cors) {
                    request.url = request.getResponseHeader("X-Url") || url
                } else {
                    request.url = request.responseURL
                }
                // console.log(request);
            }
        })

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
        return url.search(/^https?:\/\/+[^]*[:.]+\w|^[^\\\/\#\?]+\:/) >= 0
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
        loc.origin = [loc.href.match(/^https?\:[\/\\][\/\\]\w[^\/\\#]+\w/)].toString() || "null"


        if (loc.origin !== "null") {
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
        } else {
            loc.protocol = [loc.href.match(/^[^\\\/\#\?]+\:/)].toString()
            loc.pathname = loc.href.replace(/^[^\\\/\#\?]+\:/, '')
        }
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
        return url.search(/^https?:\/\/+[^]*[:.]+\w|^[^\\\/\#\?]+\:/) >= 0
    }

    var globals = {
        class: {
            reject: function () {
                    globals.callAll(globals.class._catch, arguments[0], arguments[1])
                },
                xresolve: function () {
                    globals.callAll(globals.class._beforethen, arguments[0])
                },
                resolve: function () {
                    globals.class.resolve.ready = true;
                    globals.callAll(globals.class._then, arguments[0])
                },
                progress: function () {
                    // globals.progress.total_percent=globals.toPercentage(globals.progress.loaded,globals.progress.total)
                    globals.callAll(globals.class._progress, globals.toPercentage(globals.progress.loaded, globals.progress.total), globals.progress.loaded, globals.progress.total)
                },
                _beforethen: [],
                _then: [],
                _progress: [],
                _catch: []
        },
        source_elements_queries: ['a', 'form', 'img', 'source', 'video', 'link', 'iframe'],
        source_elements: {
            HTMLAnchorElement: ['href'],
            HTMLFormElement: ['action'],
            HTMLImageElement: ['src', 'srcset'],
            HTMLSourceElement: ['src', 'srcset'],
            HTMLVideoElement: ['src', 'placeholder'],
            HTMLLinkElement: ['href'],
            HTMLIFrameElement: ['src']
        },
        New_Element_Functions: {
            HTMLAnchorElement: function (elm) {
                // globals.class.promiseobj=null
                elm = parseURL(elm.href) //.protocol.search(/^https?\:/)

                if (elm.protocol.search(/^https?\:/) >= 0) {
                    globals.request = _fetch(elm.href, {
                        return_request: true,
                        disable_cors: globals.pdt
                    }).request
                    globals.replace_window()
                }
            },
            HTMLFormElement: function (elm) {
                // globals.class.promiseobj=null
                console.log(elm);
            }
        },
        DOM: function (e) {
            var att = globals.source_elements[e.constructor.name]
            if (att) {
                globals.parse_source_element(e, att)
            }
            if (e instanceof Element || e instanceof Document || globals.window && (e instanceof globals.window.Element || e instanceof globals.window.Document)) {
                e = e.querySelectorAll(globals.source_elements_queries.toString());
                for (var i = 0; i < e.length; i++) {
                    att = globals.source_elements[e[i].constructor.name]
                    globals.parse_source_element(e[i], att)
                }
            }
        },
        frame: options.iframe instanceof HTMLIFrameElement ? options.iframe : null,
        frame_default_src: "about:blank", //'about:blank',
        pdt: true,
        defaultInjection: ``,
        location: parseURL(url),
        progress: {
            loaded: 0,
            total: 5,
            total_percent: 0
        },
        XMLHttpRequest: window.XMLHttpRequest,
        toPercentage: function (number, number_max, percentage) {
            // percentage = less than percentage (100)    (10,1000,100)
            percentage = percentage || 100;
            return Math.min((number * percentage) / number_max, percentage);
        }
    }


    if (globals.frame && globals.frame.src) {
        globals.frame.src = globals.frame_default_src
    }
    globals.callAll = function () {
        if (arguments[0] instanceof Array) {
            for (var i = 0; i < arguments[0].length; i++) {
                arguments[0][i](arguments[1], arguments[2], arguments[3])
            }
        }
    }


    globals.request = _fetch(url, {
        return_request: true,
        disable_cors: globals.pdt
    }).request

    // globals.class.promiseobj = new Promise(function () {
    //     globals.class.resolve = arguments[0];
    //     globals.class.reject = arguments[1];
    // });

    // new Promise(function () {
    //         globals.class.resolve = arguments[0];
    //         globals.class.reject = arguments[1];
    //     }).then(function(){
    //     if (globals.class.return.then.foo) {
    //         globals.callAll(globals.class.return.then.foo,arguments[0])
    //     }
    // }).catch(function(){
    //     if (globals.class.return.catch.foo) {
    //         globals.callAll(globals.class.return.then.foo,arguments[0])
    //     }
    // })

    globals.class.return = {}

    globals.class.return.beforethen = function () {
        if (arguments[0] instanceof Function) {
            globals.class._beforethen.push(arguments[0])
        }
        return globals.class.return
    }

    globals.class.return.progress = function () {
        if (arguments[0] instanceof Function) {
            globals.class._progress.push(arguments[0])
        }
        return globals.class.return
    }

    globals.class.return.then = function () {
        if (arguments[0] instanceof Function) {
            if (globals.class.resolve.ready) {
                arguments[0](globals.window)
            } else {
                globals.class._then.push(arguments[0])
            }
        }
        return globals.class.return
    }

    globals.class.return.catch = function () {
        if (arguments[0] instanceof Function) {
            globals.class._catch.push(arguments[0])
        }
        return globals.class.return
    }
    window.parseURL = parseURL
    globals.parse_source_element = function () {
        if (arguments[0].__parsed) {
            return
        }
        var url;
        for (var i = 0; i < arguments[1].length; i++) {
            if (arguments[0].hasAttribute(arguments[1][i])) {
                url = arguments[0].getAttribute(arguments[1][i]) || ""
                if (url.trim() && !parseURL.isdomain(url)) {
                    url = parseURL.join(url).href
                    arguments[0].setAttribute(arguments[1][i], url)
                }
                // arguments[1][i]
            }
        }

        arguments[0].__parsed = true;
        // console.log(arguments[0],arguments[1]);
        switch (arguments[0].constructor.name) {
            case "HTMLAnchorElement":
                arguments[0].addEventListener('click', function (e) {
                    e.preventDefault()
                    // e.stopImmediatePropagation()
                    globals.New_Element_Functions.HTMLAnchorElement(this)
                })
                break;
            case "HTMLFormElement":
                arguments[0].addEventListener("submit", function (e) {
                    e.preventDefault()
                    globals.New_Element_Functions.HTMLFormElement(this)
                    return;
                })
        }
    }

    HTMLFormElement.prototype['--submit_injection--'] = HTMLFormElement.prototype.submit

    globals.render_page = function () {


        globals.location = parseURL(globals.request.url)
        url = globals.location.href
        var response = globals.request.response

        globals.request.abort();
        delete globals.request;
        // return
        var _promisedScripts = {}
        var promisedScripts = new Promise(function () {
            _promisedScripts.resolve = arguments[0]
        });

        if (response) {
            globals.DOM(response)
            globals.class.xresolve(response)
        };



        (function (r) {
            var load = function () {
                globals.frame.removeEventListener('load', load)
                globals.window = globals.frame.contentWindow
                globals.XMLHttpRequest = globals.window.XMLHttpRequest;
                globals.window.document.FRAME_NODE = true

                globals.window.HTMLAnchorElement.prototype.click = function () {
                    if (this.__parsed) {
                        this.dispatchEvent(execScript.event('click'))
                        // globals.New_Element_Functions.HTMLAnchorElement(this)
                    } else {
                        globals.New_Element_Functions.HTMLAnchorElement(this)
                    }
                }

                globals.window.HTMLFormElement.prototype['--submit_injection--'] = globals.window.HTMLFormElement.prototype.submit
                HTMLFormElement.prototype.submit = globals.window.HTMLFormElement.prototype.submit = function () {
                    if (this.ownerDocument.FRAME_NODE) {
                        globals.New_Element_Functions.HTMLFormElement(this)
                    } else {
                        this['--submit_injection--']()
                    }
                }

                globals.window.HTMLButtonElement.prototype.click = function () {
                    if (this.form instanceof globals.window.HTMLFormElement && this.type === "submit" && !this.form.__parsed) {
                        globals.New_Element_Functions.HTMLFormElement(this.form)
                    } else {
                        this.dispatchEvent(execScript.event('click'))
                    }
                }

                // response.documentElement
                // globals.window.document.addEventListener('DOMNodeInserted', function (e) {
                //     var att = globals.source_elements[e.target.constructor.name]
                //     if (att) {
                //         globals.parse_source_element(e.target, att)
                //     }
                //     if (e.target instanceof Element || e.target instanceof globals.window.Element) {
                //         e = e.target.querySelectorAll(globals.source_elements_queries.toString());
                //         for (var i = 0; i < e.length; i++) {
                //             att = globals.source_elements[e[i].constructor.name]
                //             globals.parse_source_element(e[i], att)
                //         }
                //     }
                // })
                r()
            }

            if (globals.frame) {
                if (!globals.frame_ready) {
                    globals.frame_ready = true
                    // document.body.appendChild(globals.frame);
                    load()
                } else {
                    globals.frame.src = globals.frame_default_src
                    // globals.frame.contentWindow.location.reload()
                    // var d=Date.now()
                    // requestAnimationFrame
                    // setTimeout
                    // (function(){
                    //     console.log(globals.frame.contentDocument,Date.now()-d);
                    // },33)
                    // globals.frame.onload=load
                    // var d =
                    globals.frame.addEventListener('load', load)
                    globals.frame.addEventListener('beforeunload', function () {
                        console.log(9);
                    })
                    // console.log(d);
                }
            } else {
                globals.window = {
                    __proto__: window,
                    document: document.cloneNode()
                }
                globals.window.document.appendChild(document.createElement('html'))
                globals.window.document.documentElement.innerHTML = `<head></head><body></body>`
                r()
            }

        })(function () {

            if (!response) {
                globals.class.xresolve(globals.window.document)
            }

            // console.log(globals.window.location);
            globals.window.x_location = parseURL(url)
            globals.window.eval(globals.defaultInjection)

            if (response) {
                globals.window.document.replaceChild(response.documentElement, globals.window.document.documentElement)
                globals.class.resolve(globals.window)
            } else {
                globals.class.reject(parseURL(url), globals.window)
            }
            // globals.DOM(globals.window.document)

            ;
            (globals.window.MutationObserver ? function (foo, elm) {
                new globals.window.MutationObserver(function (e) {
                    for (var i = 0; i < e.length; i++) {
                        for (var _i = 0; _i < e[i].addedNodes.length; _i++) {
                            foo(e[i].addedNodes[_i]);
                        }
                    }
                }).observe(elm || document, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                })
            } : function (foo) {
                console.error('browser not support')
                elm.addEventListener('DOMNodeInserted', function (e) {
                    foo(e.target);
                })
            })(globals.DOM, globals.window.document);

            var scripts = options.parse_javascript ? globals.window.document.scripts : []
            globals.window.global = globals.window


            /**
             *
             * @ACTIONS below code should run only if requests are successfull, eslse return code here and execute 
             * globals.class.reject(<msg>) 
             * globals.progress.loaded += 1
             * globals.class.progress() 
             * 
             */

            // if (response) {
            //     globals.class.resolve(globals.window)
            // }else{
            //     globals.class.reject(globals.window)
            // }

            globals.progress.loaded += 0.5
            globals.class.progress()

            /**
             * @ACTIONS makes frame full window (no parent)
             * @NOTE code would'nt run - cuz the fellowing properties are inreplaceable
             *   globals.window.top=globals.window
             *  globals.window.parent=globals.window
             *  globals.window.frames=globals.window
             */




            var events = globals.frame ? [
                execScript.event("beforeunload"),
                [execScript.event('beforeunload'), ['body']],
                [execScript.event("DOMContentLoaded")],
                [execScript.event("readstatechange")],
                execScript.event('load'),
                [execScript.event('load'), ['body']]
            ] : [];

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
                    globals.progress.loaded += 0.5
                    globals.class.progress()
                    return
                }
                execScript.getString(scripts[i]).then(function (__e, s) {
                    if (__e) {
                        promisedScripts.then(function () {
                            execScript(__e, s)
                        });
                    }
                    requestAnimationFrame(call)
                });
                i += 1
            })();

        })

    }

    globals.replace_window = function () {
        globals.request.addEventListener("readystatechange", function () {
            if (typeof globals.progress.total !== 'number') {
                globals.progress.total = arguments[0].target.DONE + 1
            }
            globals.progress.loaded = arguments[0].target.readyState
            globals.class.progress()
        })
        globals.request.addEventListener("progress", function (e) {
            globals.progress.loaded += globals.toPercentage(e.loaded, e.total, 0.9)
            globals.class.progress()
        })
        globals.request.addEventListener('load', globals.render_page)
        globals.request.addEventListener('error', globals.render_page)
    }

    globals.replace_window();

    function execScript(a) {
        //danger
        try {
            globals.window.eval(arguments[0])
        } catch (e) {
            // console.log(e);
        }
    }

    execScript.event = function (name) {
        var ev = globals.window.document.createEvent("Event");
        ev.initEvent(name, true, true)
        // var ev = new Event(name,{bubbles: true,cancelable:true,target:{}})
        return ev
    }

    execScript.getString = function (script) {
        return new Promise(function (r) {
            if (script.type && script.type !== "text/javascript") {
                return
            }
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
                        // console.log(script,arguments[0].response);
                    } else {
                        r()
                    }
                    arguments[0].abort()
                }).catch(function () {
                    r()
                });
            } else {
                r(script.innerHTML)
                // console.log(script);
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
var d = document;
scraper(src, {
    parse_javascript: false,
    iframe: iframe,
}).beforethen(function (document) {
    // var style = window.document.querySelector('[as="head"]')
    // document.head.appendChild(style.content.cloneNode(true))
}).progress(function (e) {
    // console.log(e);
}).then(function (window, document) {
    document = window.document
    var ctx = document.querySelector("body>div>table") || document.querySelector("body>div.site>div.site-content>section.content-archive")
    if (ctx) {
        // document.body.innerHTML = ''
        // document.body.appendChild(ctx)
    }
    // console.log(document);
    console.log("page loaded");
}).catch(function (msg, window) {
    console.log("page error", msg);
});


// ;
// (function (e) {
//     var window = {
//         __proto__: global
//     }



// })();