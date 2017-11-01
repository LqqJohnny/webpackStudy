import '../css/common.css'
import '../css/sakura.css'
//  注意以上 css的引入方式
import html from "../pages/page1.md"

function App(){
    var app = document.getElementById("app");
    app.innerHTML=html;
}


new App();
