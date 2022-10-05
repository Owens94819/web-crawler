function search(url) {
    url=body.querySelector('.sh>input').value.trim();
    if(!url) return;
    if (0>url.search(/^https?\:[\\\/][\\\/]+/)) {
        url="https://"+url
    }
    if (0>url.search(/^https?\:[\\\/][\\\/]\w+[\.\:]\w/)) {
        url=body.querySelector('.sh>input').value.trim()
        url=`https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=${encodeURIComponent(url)}&start=0`
    }

    page.replace(url)
    // console.log(url);
}

function back() {
    back.urls.pop()
var url=back.urls.pop()
if (2>back.urls.length) {
    body.querySelector('.bk>button').style.display='none'
}
if (!url) {
    return
}
body.querySelector('.sh>input').value=url
page.replace(url)
}
back.urls=[null];

var page = scraper("http://localhost:1234/test/test.html", {
    // parse_javascript: false,
    iframe: iframe,
}).beforethen(function (document) {
    if (back.urls.length>1) {
        body.querySelector('.bk>button').style.display=''
    }
    back.urls.push(page.current_location().href)
    body.querySelector('.sh>input').value=back.urls[back.urls.length-1]
    // try {
    //     document.querySelector('body>div').remove()
    // document.querySelector('body>div:last-child').remove()
    // document.querySelector('body>div:last-child').remove()
    // } catch (error) {
        // 
    // }
    // var style = window.document.querySelector('[as="head"]')
    // document.head.appendChild(style.content.cloneNode(true))
}).progress(function (e) {
    document.querySelector('.nav .progress').style.width=e+'%'
    if (e===0) {
        document.querySelector('.nav').setAttribute('pending','')
    }else if(e===100){
        setTimeout(function(){
    document.querySelector('.nav .progress').style.width=''
            document.querySelector('.nav').removeAttribute('pending')
        },1000)
    }
}).then(function (window, document) {
    document = window.document
    var ctx = document.querySelector("body>div>table") || document.querySelector("body>div.site>div.site-content>section.content-archive")
    if (ctx) {
        // document.body.innerHTML = ''
        // document.body.appendChild(ctx)
    }
}).catch(function (msg, window) {
    console.log("page error", msg);
    window.document.body.innerHTML="could not load content at ["+msg.origin+"]."
});

console.log(page);
