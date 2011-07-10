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

document.body.innerHTML +="   -JavaScript Loaded"


