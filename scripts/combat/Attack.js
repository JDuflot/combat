import clickSound from "../../assets/sounds/click.mp3";


export default class Attack {
	constructor(
			name,
			energyRequired,
			damage,
			game,
			animationName, 
      sound
	) {
			this.name = name;
			this.energyRequired = energyRequired;
			this.damage = damage;
			this.game = game;
			this.animationName = animationName;
      this.sound = sound;
	}

	createHtmlElmt(htmlParent, classList) {
			this.button = document.createElement('button');
			this.button.textContent = `${this.name} (${this.energyRequired} énergie requise) (${this.damage} PV perdus)`;
			htmlParent.appendChild(this.button);
			this.button.classList = classList;

			this.addEventOnButton();
	}
	addEventOnButton(){
			this.button.addEventListener(
					'click',
					() => {
            const audio = new Audio(clickSound);
            audio.volume = 0.2;
            audio.play();

						this.game.launchCharacterAttack(this);
					}
			)
	}
  launchSoundAttack(){
          if(this.sound){
            const audioAttack = new Audio(this.sound);
            audioAttack.play();
          }
  }

}