import Character from "./Character.js";
import { capitalize } from "../utils.js";

export default class Enemy extends Character {
	constructor(
			healthPoints,
			energyAvailable,
			name,
			imageSource,
			isDarkSide,
			game,
			attacks,
			chosenCharacter
	){
			super(
			healthPoints,
			energyAvailable,
			name,
			imageSource,
			isDarkSide,
			game,
			attacks,
			chosenCharacter
			);

	}

	selectAnAttack() {
			this.attacks.sort((a, b) => {
				if(a.damage > b.damage){
					return -1;
				} else if(a.damage < b.damage){
					return 1;
				} else {
					return 0;
				}
			});
			let selectedAttack = this.attacks[this.attacks.length - 1];
			for(let attack of this.attacks) {
				if(attack.energyRequired <= this.energy){
					selectedAttack = attack;
					break;
				}
			}
			return selectedAttack;

	}
	attackCharacter(animationName) {
		return new Promise (async(resolve) => {

			const selectedAttack = this.selectAnAttack();
	
				if (
					this.healthPoints > 0 && this.energy >= selectedAttack.energyRequired
				) {
          if(this.criticalFailure(this.game.luckyCriticalFailure)){
            this.createInfo(`${capitalize(this.name)} réalise un échec critique : - 10 PV`);
            this.removeHealthLife(10);
            this.reduceEnergy(selectedAttack.energyRequired);
            this.isInjured();
          }else{
            selectedAttack.launchSoundAttack();
            this.createInfo(`${capitalize(this.game.enemy.name)} attaque ${capitalize(this.game.character.name)} avec ${selectedAttack.name}`);
  
            await selectedAttack.game.globalScene.characters3D[selectedAttack.game.enemy.name].playAnimation(selectedAttack.animationName);
    
              this.game.character.removeHealthLife(selectedAttack.damage);
              this.reduceEnergy(selectedAttack.energyRequired);
  
              await this.game.character.isInjured(animationName);
          }

	
						setTimeout(async() => {
							await	this.removeInfo();
								if (
									this.game.character.healthPoints > 0 && this.game.character.energy >= this.game.character.minimumEnergy
								) {
										resolve(true);
								} else if (
									this.game.character.healthPoints > 0 && this.energy >= this.minimumEnergy
								) {
									this.attackCharacter(animationName);
									resolve(false);
								} else {
                  this.checkWoWin(resolve);
                }
						}, 1500);
	
				} else if (
					this.healthPoints > 0 && this.energy >= this.minimumEnergy
				){
					this.attackCharacter(animationName);
					resolve(false);
				} else if (
					this.healthPoints > 0
				) {
					this.createInfo(`${capitalize(this.name)} N'a pas assez d'énergie pour jouer`)
					setTimeout(
            async () => {
							 await this.removeInfo();
               if (
                this.game.character.healthPoints > 0 && this.game.character.energy >= this.game.character.minimumEnergy
              ) {
                  resolve(true);
                } else {
                  this.checkWoWin(resolve);
                }
						}, 2000
				)
				} else {
						this.game.character.winner();
						resolve(false);
				}
		})
	};

checkWoWin(resolve){
  if (
    this.game.character.getHealthPointsPercentage() > this.getHealthPointsPercentage()
  ){ 
    this.game.character.winner();
    resolve(false);
  } else {
    this.winner();
    resolve(false);
  }
}

}

