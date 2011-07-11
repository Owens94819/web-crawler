function search(url) {
    url=body.querySelector('.sh>input').value.trim();
    if(!url) return;
    if (0>url.search(/^https?\:[\\\/][\\\/]+/)) {
        url="https://"+url
    }
    if (0>url.search(/^https?\:[\\\/][\\\/]\w+[\.\:]\w/)) {
        url=body.querySelector('.sh>input').value.trim()
        url=search.eng(url)
    }

    page.replace(url)
    // console.log(url);
}
search.eng = function(url){
    return `https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=${encodeURIComponent(url)}&start=0`
}

function back() {
    back.urls.pop()
var url=back.urls.pop()
if (back.urls.length <=0) {
    body.querySelector('.bk>button').style.display='none'
}
if (!url) {
    return
}
body.querySelector('.sh>input').value=url
page.replace(url)
}
back.urls=["http://localhost:1234/test/test.html",search.eng('moon')];

/** Google image */

var page = scraper(back.urls[0], {
    // parse_javascript: false,
    iframe: iframe,
}).beforethen(function (document) {
    if (back.urls.length>=1) {
        body.querySelector('.bk>button').style.display=''
    }
    back.urls.push(page.current_location().href)
    body.querySelector('.sh>input').value=back.urls[back.urls.length-1]
    try {
        document.querySelector('body>div>div:last-child').remove()
    document.querySelector('body>div:last-child').remove()
    document.querySelector('body>div:last-child').remove()
    } catch (error) {
        
    }
    var style = window.document.querySelector('[as="head"]')
    document.head.appendChild(style.content.cloneNode(true))
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

}).catch(function (msg, window) {
    console.log("page error", msg);
    window.document.body.innerHTML="could not load content at ["+msg.origin+"]."
}).onredirection(function(location,element){
    if (element.parentElement.className==="X6ZCif") {
        location.href=search.eng(element.innerText)
    }else if(element.firstChild.localName==="div"){
      location.preventDefault=true
    }
    console.log(location,element);
});

// console.log(page);
scraper("http://google.com")
// var page = scraper("http://localhost:1234/test/test.html", {
//     // parse_javascript: false,
//     iframe: iframe,
// }).beforethen(function (document) {
//     if (back.urls.length>1) {
//         body.querySelector('.bk>button').style.display=''
//     }
//     back.urls.push(page.current_location().href)
//     body.querySelector('.sh>input').value=back.urls[back.urls.length-1]
//     // try {
//     //     document.querySelector('body>div').remove()
//     // document.querySelector('body>div:last-child').remove()
//     // document.querySelector('body>div:last-child').remove()
//     // } catch (error) {
//         // 
//     // }
//     // var style = window.document.querySelector('[as="head"]')
//     // document.head.appendChild(style.content.cloneNode(true))
// }).progress(function (e) {
//     document.querySelector('.nav .progress').style.width=e+'%'
//     if (e===0) {
//         document.querySelector('.nav').setAttribute('pending','')
//     }else if(e===100){
//         setTimeout(function(){
//     document.querySelector('.nav .progress').style.width=''
//             document.querySelector('.nav').removeAttribute('pending')
//         },1000)
//     }
// }).then(function (window, document) {
//     document = window.document
//     var ctx = document.querySelector("body>div>table") || document.querySelector("body>div.site>div.site-content>section.content-archive")
//     if (ctx) {
//         // document.body.innerHTML = ''
//         // document.body.appendChild(ctx)
//     }
// }).catch(function (msg, window) {
//     console.log("page error", msg);
//     window.document.body.innerHTML="could not load content at ["+msg.origin+"]."
// });

// console.log(page);
