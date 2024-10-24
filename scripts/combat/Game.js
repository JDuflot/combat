import Attack from './Attack.js';
import Enemy from './Enemy.js';
import Character from './Character.js';
import GlobalScene from '../three/GlobalScene.js';
import Menu from './Menu.js';

import lukeGltf from "../../assets/gltf/luke_v05.glb"
import vadorGltf from "../../assets/gltf/vador_v06.glb"

import piouFriouSound from "../../assets/sounds/piou-friou.mp3";
import friouSound from "../../assets/sounds/friou.mp3";
import piouSound from "../../assets/sounds/piou-piou.mp3";
import lightSaberSound from "../../assets/sounds/light-saber.mp3";
import forceSound from "../../assets/sounds/force.mp3"; 
import regardSound from "../../assets/sounds/regard.mp3";
import saltoSound from "../../assets/sounds/salto.mp3";
import tournisSound from "../../assets/sounds/tournis.mp3";



export default class Game {
  constructor() {
    this.luckyCriticalFailure = 1 / 5;
    const nameChosenCharacter = localStorage.getItem("choice");

    const isLuke = nameChosenCharacter == "luke";
    const isVador = nameChosenCharacter == "vador";

    this.create3DElmts(isLuke, isVador);
    // this.menu = new Menu();
  }

  // Nouvelle méthode pour initialiser les personnages après chargement des GLTF
  initializeCharacters() {
    const nameChosenCharacter = localStorage.getItem("choice");

    const isLuke = nameChosenCharacter == "luke";
    const isVador = nameChosenCharacter == "vador";

    if (isVador) {
      this.enemy = this.createLuke(isLuke);
      this.character = this.createVador(isVador);
    } else {
      this.enemy = this.createVador(isVador);
      this.character = this.createLuke(isLuke);
    }

    // Désactiver les boutons avant l'activation
    this.character.disabledButtons();
  
    this.menu = new Menu();
    // this.launchConfetti();
  }

	create3DElmts(isLuke, isVador) {
		this.globalScene = new GlobalScene({
      game: this,
			idCanvas: "canvas",
			divCanvasCssSelector: ".canvas",
			cameraCoordinates: {x: 0, y: 2.5, z: 8},
			cameraCoordinatesMobile: {x: 0, y: 2.5, z: 7},
			gltfCharacters: [
				{
				name: "vador",
				gltf: vadorGltf,
				coordinates: { x: isVador ? -3 : 3, y: 0, z: 0 },
				coordinatesMobile: { x: isVador ? -2 : 2, y: 0, z: 0 },
				rotation: { x: 0, y: isVador ? 60 : -60, z: 0 },
				initAnimation: "idle",
        needChangeColorSaber : isVador
			},
				{
				name: "luke",
				gltf: lukeGltf,
				coordinates: { x: isLuke ? -3 : 3, y: 0, z: 0 },
				coordinatesMobile: { x: isLuke ? -2 : 2, y: 0, z: 0 },
				rotation: { x: 0, y: isLuke ? 60 : -60, z: 0 },
				initAnimation: "Idle",
        needChangeColorSaber : isLuke
			}
		],
		colorLights: 0xff0000
		});
	}

	createLuke(isChosen){
			let characterType = isChosen ? Character : Enemy;
			const luke = new characterType({
				healthPoints: 100,
				energy: 200,
				name: "luke",
				isDarkSide:	false,
				game:	this,
				attacks: [
							new Attack("salto", 70, 40, this, "salto", saltoSound),
							new Attack("tournis", 20, 30, this, "tourni", tournisSound ),
							new Attack("pointe", 10, 10, this, "pointe", lightSaberSound)
					],
					chosenCharacter: isChosen 
	});
			return luke;
	}
	createVador(isChosen){
			let characterType = isChosen ? Character : Enemy;
			const vador = new characterType({
				healthPoints:	150,
				energy:	150,
				name:	"vador",
				isDarkSide: true,
				game:	this,
				attacks:	[
							new Attack("force", 55, 25, this, "force", forceSound ),
							new Attack("projection du sabre", 15, 20, this, "launchsaber", lightSaberSound),
							new Attack("regard perçant", 10, 10, this, "regard", regardSound)
					],
					chosenCharacter: isChosen 
	});
			return vador;
	}

	async launchCharacterAttack(attack){
    this.character.disabledButtons();
		this.menu.onClickHeart();
		const launchEnemyAttack = await this.character.attackCharacter(
			"animation-attack-left-right",
			attack,
		);
		if(launchEnemyAttack){
			this.afterAttackCharacter();
		};
	}


	async afterAttackCharacter(){
			const activedAllButtons = await this.enemy.attackCharacter(
				"animation-attack-right-left",
			);
			if(activedAllButtons){
				this.character.activedAllButtons();
				this.menu.onClickWeapon();
			}
	}

  launchConfetti(){
    const videoConfetti = document.querySelector(".confetti");
    videoConfetti.classList.remove("confetti-hidden");
    videoConfetti.play();
  }

}