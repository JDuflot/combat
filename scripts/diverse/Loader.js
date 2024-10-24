export default class Loader {
    constructor(cssDivSelector){
        this.parent = document.querySelector(cssDivSelector);
        this.createHtml();
    }

    createHtml(){
        this.html = document.createElement('div');
        this.html.classList.add('loader');
    }

    add(){
        this.parent.appendChild(this.html);
    }
    remove(){
        this.parent.removeChild(this.html);
    }
}