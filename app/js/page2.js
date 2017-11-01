import '../css/sakura.css'
import html from "../pages/page2.md"

function App(){
    var app = document.getElementById("app");
    app.innerHTML=html;
}
new App();
