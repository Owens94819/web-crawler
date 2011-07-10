// location=9
// addEventListener("load",function(e){
//     console.log(e.type);
// })
if (window.MutationObserver) {
    observe = function (foo, elm) {
        new MutationObserver(function (e) {
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
    }
} else {
    observe = function (foo) {
        console.error('browser not support')
        addEventListener('DOMSubtreeModified' || 'DOMNodeInsertedIntoDocument' || 'DOMNodeInserted' || 'DOMContentLoaded' || 'DOMCharacterDataModified' || 'DOMNodeInsertedIntoDocument', function (e) {
            e = e.target
            console.log(e);
            foo(e);
        })
    }
}

// observe(function(e){
//     console.log(e);
// })

// document.addEventListener('DOMNodeInserted',function(e){
//     console.log(e.target);
// })
// var d=document.createElement('pp')
// d.innerHTML=`
// <form action="/ggf" method="post" enctype="multipart/form-data" id="form">
// <input type="text" name="name">
// <input type="text" name="name2">
// <input type="text" name="name3">
// <button type="submit" id="btn">fff</button>
//     </form>
// `
// f=d.querySelector('form')
// b=f.querySelector('button')
// f.submit()
// document.body.appendChild(d)
// console.log(b.click());
// document.body.innerHTML +="   -JavaScript Loaded"


