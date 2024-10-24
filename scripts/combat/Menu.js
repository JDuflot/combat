export default class Menu {
    constructor(){
        this.buttonHeart = document.getElementById("heart");
        this.buttonWeapon = document.getElementById("weapon");

        this.divAttacks = document.querySelector(".attacks");
        this.divCharacters = document.querySelector(".characters");

        this.sizeMobile = 700;

        this.addEventListenersOnButtons();
        this.checkIfMobile();
        this.addEventOnResize();
    }

    checkIfMobile() {
        if(window.innerWidth < this.sizeMobile){
            this.onClickHeart();
        } else{
            this.showAll();
        }
    }

    addEventOnResize(){
        window.addEventListener("resize", this.checkIfMobile.bind(this));
    }

    showAll(){
      this.divAttacks.style.opacity = "1";
    this.divCharacters.style.opacity = "1";
    }

    onClickHeart(){
        if(window.innerWidth < this.sizeMobile){
            this.divAttacks.style.opacity = "0";
            this.divCharacters.style.opacity = "1";
            this.buttonHeart.classList.add("button-active");
            this.buttonWeapon.classList.remove("button-active");
        }else{
            this.showAll();
        }
    }
    onClickWeapon(){
        if(window.innerWidth < this.sizeMobile){
            this.divAttacks.style.opacity = "1";
            this.divCharacters.style.opacity = "0";
            this.buttonWeapon.classList.add("button-active");
            this.buttonHeart.classList.remove("button-active");
        }else{
            this.showAll();
        }
    }

    addEventListenersOnButtons(){
        this.buttonHeart.addEventListener("click", this.onClickHeart.bind(this));
        this.buttonWeapon.addEventListener("click", this.onClickWeapon.bind(this));
    }
}