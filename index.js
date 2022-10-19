function search(url) {
    if (!url) return;

    if (0 > url.search(/^https?\:[\\\/][\\\/]+/)) {
        url = "https://" + url
    }
    if (0 > url.search(/^https?\:[\\\/][\\\/]\w+[\.\:]\w/)) {
        url = body.querySelector('.sh>input').value.trim()
        url = search.eng(url)
    }

    load(url)
}
search.eng = function (url) {
    return `https://www.google.com/search?hl=en-NG&gbv=2&biw=1350&bih=663&tbm=isch&oq=&aqs=&q=${encodeURIComponent(url)}&start=0`
}

function back() {
    back.urls.pop()
    var url = back.urls.pop()
    if (back.urls.length <= 0) {
        body.querySelector('.bk>button').style.display = 'none'
    }
    if (!url) {
        return
    }
    body.querySelector('.sh>input').value = url
    load(url)
}

function load(url) {
    iframe.contentWindow.postMessage({
        state: '--reload--',
        data: url
    }, '*')
}

back.urls = ["http://localhost:12345/http%3A%2F%2Flocalhost%3A1234/test/home.html"];
iframe.src=back.urls[0]