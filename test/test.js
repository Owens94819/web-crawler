// location=9
// a='test'
// window.top.k=55
// window.top.postMessage('test','*')
// onmessage = function(e){
//     console.log(e);
// }
// addEventListener("load",function(e){
//     console.log(e.type);
// })
// console.log(88);
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


  var rg=new RegExp(`(<(link|script)\\s[^>]+(src|href)=\\")(https?:[\\\\\\/][\\\\\\/]${location.host}|[\\\\\\/])?([^]+)"*([^>]>)`,'img')
   s= `
   
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <link rel="stylesheet" href="style.css">
       <link rel="stylesheet" href="style.css">
       <script src="script.js"></script>
       <title>Document</title>
       <script>
               //         console.log(window.onload);
               //         window.addEventListener("DOMContentLoaded",function(e){
               //     console.log(6);
               // })
       </script>
   </head>
   <body xonload="alert(9)">
       <h1>test 2</h1>
   </body>
       <script>
           // window.addEventListener("DOMContentLoaded",function(e){
           //         console.log(2);
           //         // _promisedScripts.resolve()
           //     })
           // window.document.body.onload = function(){
           //     console.log('lll');
           // }
       </script>
   </html>
   
   
   `
   //.split(/(<link+\s[^>]+href[^=>]=[^\s>]+> )/img)
   //<link rel="stylesheet" href=   style.css >'.replace(/(<link+\s[^>]+\shref[^\w>]+)([^=>]+)(>)/img,'$1__$2$3')
   
   //.replace(rg,'$1https://mon.com/$3$4$5$6')
// console.log(s);