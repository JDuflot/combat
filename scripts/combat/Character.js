import { capitalize } from "../utils.js";
import PopUp from "./PopUp.js";

import screamSound from "../../assets/sounds/crie1.mp3"
import scream2Sound from "../../assets/sounds/crie2.mp3"
import scream3Sound from "../../assets/sounds/crie3.mp3"
import applauseSound from "../../assets/sounds/applause.mp3"

  export default class Character {
    constructor({ 
      healthPoints, 
      energy,
      name, 
      isDarkSide,
      game, 
      attacks,
      chosenCharacter
    }){
      this.healthPoints = healthPoints;
      this.initialHealthPoints = healthPoints;
      this.energy = energy;
      this.initialEnergy = energy;
      this.name = name;
      this.isDarkSide = isDarkSide;
      this.game = game;
      this.attacks = attacks;
      this.chosenCharacter = chosenCharacter;
      this.minimumEnergy;

      this.divCharacters = document.querySelector(".characters");
      
      this.createHtml(name);
      this.createHtmlLife();
      this.createHtmlEnergy();
      this.createAttacks();
    }
    
  createHtml(name){
      this.divCharacter = document.createElement("div");
      this.divCharacter.classList.add("character");
      this.divCharacter.classList.add(name);

      
      this.divCharacters.appendChild(this.divCharacter);

      if(this.chosenCharacter){
        this.createPseudo(localStorage.getItem("pseudo"));
      } else {
        this.createPseudo(this.name);

      }
  }

  createPseudo(text){
    const pseudo = document.createElement("p");
    const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);

    pseudo.textContent = capitalizedText;
    pseudo.classList.add("pseudo");
    this.divCharacter.appendChild(pseudo);
  }


  createHtmlLife(){
      this.createParagraphLife();
      const totalLife = document.createElement("div");
      totalLife.classList.add("total-bar");
      this.divLife = document.createElement("div");
      this.divLife.classList.add("life");
      this.divLife.classList.add("loading-bar");
      this.divCharacter.appendChild(totalLife);
      totalLife.appendChild(this.divLife);
      this.divLife.style.width = "100%";
  }

  createHtmlEnergy(){
      this.createParagraphEnergy()
      const energyTotal = document.createElement("div");
      energyTotal.classList.add("total-bar");
      this.divEnergy = document.createElement("div");
      this.divEnergy.classList.add("energy");
      this.divEnergy.classList.add("loading-bar");
      this.divCharacter.appendChild(energyTotal);
      energyTotal.appendChild(this.divEnergy);
      this.divEnergy.style.width = "100%";
  }


  createAttacks(){
    let attacksDiv;
    let classList;
      if (this.chosenCharacter){
        attacksDiv = document.createElement("div");
        attacksDiv.classList.add("attacks");
        document.querySelector(".game").appendChild(attacksDiv);

          this.createParagraph(attacksDiv, "Mes attaques :")

          if(this.isDarkSide){
              classList = ["red-illumination"]
          } else {
              classList = ["green-illumination"]
          }
        this.divCharacter.classList.add("first");
      }

          for(let attack of this.attacks){
            if(this.chosenCharacter){
              attack.createHtmlElmt(
              attacksDiv,
              classList
          );
          }
          if(
            !this.minimumEnergy ||
            this.minimumEnergy > attack.energyRequired
          ){
            this.minimumEnergy = attack.energyRequired
          }
      }
 
  }

  criticalFailure(lucky){
    // console.log(lucky);
    return Math.random() < lucky;
    // return true;
  }

  attackCharacter(
    animationName,
    attackChosen
  ){
    return new Promise(async (resolve) => {
      if(this.healthPoints > 0 && this.energy >= attackChosen.energyRequired) {
        if(this.criticalFailure(this.game.luckyCriticalFailure)){
          // console.log("echec");
          this.createInfo("Échec critique : - 10 PV");
          this.removeHealthLife(10);
          this.reduceEnergy(attackChosen.energyRequired);
          await this.isInjured(animationName);
          await this.removeInfo(1000);
        }else {
          // console.log("reussite");
          attackChosen.launchSoundAttack();
          await this.game.globalScene.characters3D[this.game.character.name].playAnimation(attackChosen.animationName);

          this.game.enemy.removeHealthLife(attackChosen.damage);

          this.reduceEnergy(attackChosen.energyRequired);
          await this.game.enemy.isInjured(animationName);
        }
       if(this.healthPoints > 0){
        resolve(true);
       }else{
        this.game.enemy.winner();
        resolve(false);
       }
      }else if (this.healthPoints > 0 && this.energy >= this.minimumEnergy) {
        new PopUp(
          "Tu n'as plus assez d'énergie pour effectuer cette attaque. Choisis-en une autre !",
          () => {}
        );
        this.activedAllButtons();
        resolve(false);
      } else if (this.healthPoints > 0) {
        resolve(true);
      } else {
        this.game.enemy.winner();
        resolve(false);
      }
    });
  }

  async isInjured(animationName){
    const sounds = [ screamSound, scream2Sound, scream3Sound];
    const index = Math.floor(Math.random() * sounds.length);
    const sound = new Audio(sounds[index]); 
    sound.volume = 0.5;
    sound.play();

    this.addAnimationAttack(animationName);

    await this.game.globalScene.characters3D[this.name].playAnimation("punch");
  }

  reduceEnergy(attackEnergy){
      const factor = 100 / this.initialEnergy;
      this.energy = this.energy - attackEnergy;
      this.divEnergy.style.width = `calc(${this.energy * factor}% - var(--padding-life))`;
      this.editParagraphEnergy();
  }

  removeHealthLife(healthPoints){
      const factor = 100 / this.initialHealthPoints;
      this.healthPoints = this.healthPoints - healthPoints; 
      this.divLife.style.width = `calc(${this.healthPoints * factor}% - var(--padding-life))`;
      this.editParagraphLife();
  }

  createParagraph(htmlParent, text){
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      htmlParent.appendChild(paragraph);
  }

  createParagraphLife(){
    this.paragraphLife = document.createElement("p");
    this.editParagraphLife();
    this.divCharacter.appendChild(this.paragraphLife);
  }

  editParagraphLife(){
    this.paragraphLife.textContent = `Vie restante : ${this.healthPoints} / ${this.initialHealthPoints}`
  }

  createParagraphEnergy(){
    this.paragraphEnergy = document.createElement("p");
    this.editParagraphEnergy();
    this.divCharacter.appendChild(this.paragraphEnergy);
  }

  editParagraphEnergy(){
    this.paragraphEnergy.textContent = `Energie restante : ${this.energy} / ${this.initialEnergy}`;
  }

  createInfo(text){
    this.info = document.createElement("p");
    this.info.textContent = text;
    document.querySelector(".info").appendChild(this.info);
}

  removeInfo(miliseconds = 0){
    return new Promise ((resolve) => {
      setTimeout(() => {
        document.querySelector(".info").removeChild(this.info)
        resolve();
      }, miliseconds)
    })
  }

  addAnimationAttack(animationName){
      this.divCharacter.classList.add(animationName);

      let duration = getComputedStyle(document.body).getPropertyValue("--duration-animation-attack");

      duration = duration.replace("ms", "");
      duration = parseInt(duration);

      setTimeout( () => {
          this.removeAnimationAttack(animationName);
      }, duration);
  }

  removeAnimationAttack(animationName){
      this.divCharacter.classList.remove(animationName);
  }

  winner(){
      const results = document.querySelector(".results");

      const p = document.createElement("p");
      p.textContent = `${capitalize(this.name)} a gagné !`;

      results.appendChild(p);

      if(this.chosenCharacter){
        const sound = new Audio(applauseSound);
        sound.volume = 0.5;
        sound.play(); 
        this.game.launchConfetti();
      }
  }

  getHealthPointsPercentage(){
    return this.healthPoints / this.initialHealthPoints;
  }

  disabledButtons(){
    for (let attack of this.attacks){
        attack.button.classList.add('disabled-but-visible');
    }
}
  activedAllButtons(){
    for (let attack of this.attacks){
        attack.button.classList.remove('disabled-but-visible');
    }
}

}


