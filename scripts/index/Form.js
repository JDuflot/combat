export default class Form {
	constructor(globalScenes) {
    this.globalScenes = globalScenes;

			this.buttons = document.querySelectorAll(".characters button");
			this.form = document.querySelector ("form");
			this.submitButton = document.querySelector("form button");
			this.vador = document.querySelector(".vador");
			this.luke = document.querySelector(".luke");
			this.inputs = document.getElementsByTagName("input");
			this.validatedInputs = [];

			this.showForm();
      this. onSelectColor();
			this.checkInputsWithEvent();
			this.goTocombatPage();
			}

	showForm () {
			for (let button of this.buttons) {
					button.addEventListener(
							"click",
								() => this.onClickButton(button)
					);
			}
	}
	
  onSelectColor(){
    document.querySelector(".color input").addEventListener("input", (event) => {
      for( let scene of this.globalScenes){
        if(scene.idCanvas.includes(this.nameCharacterSelected)
        ){
          const color = event.target.value
          scene.characters3D[this.nameCharacterSelected].updateColorSaber(color);
          localStorage.setItem("colorSaber", color);
          break;
        }
      }
      
    })
  }


	onClickButton(button) {
			this.enabledHtmlElmt(this.form);
			this.form.classList.add("translate-null");
	
			if(button.value == "luke") {
						this.disabledHtmlElmt(this.vador);
						this.submitButton.classList.add("green-illumination");
			} else {
						this.disabledHtmlElmt(this.luke);
						this.submitButton.classList.add("red-illumination");
			}
      this.nameCharacterSelected = button.value;
			localStorage.setItem("choice", button.value);
			this.checkInput()
	}
	
	goTocombatPage() {
			this.submitButton.addEventListener(
					"click", 
					this.onClickSubmitButton.bind(this)
			)
	}
	
	onClickSubmitButton(event) {
			event.preventDefault();
			localStorage.setItem("pseudo", this.inputs[0].value);
			window.location.href = "/combat.html";
	}
	
	checkInputsWithEvent()  {
			for (let input of this.inputs) {
					input.addEventListener(
							"input",
							() => this.onDetectChangeInInput(input)
					);
			}
	}

	checkInput(){
			for (let input of this.inputs) {
					this.onDetectChangeInInput(input);
			}
	}
	
	onDetectChangeInInput(input) {
			if (input.value != "" && !this.validatedInputs.includes(input)
			){
					this.validatedInputs.push(input);
			} else if (
					input.value == "" &&
					this.validatedInputs.includes(input)
			){
					this.validatedInputs = this.validatedInputs.filter(
							elmt => input != elmt
			);
			}
			if(this.validatedInputs.length == this.inputs.length) {
					this.enabledHtmlElmtVisible(this.submitButton);
			}
	}
	
	enabledHtmlElmtVisible(htmlElmt){
			htmlElmt.classList.remove("disabled-but-visible");
	}
	
	disabledHtmlElmt(htmlElmt){
			htmlElmt.classList.add("disabled");
	}
	
	enabledHtmlElmt(htmlElmt){
			htmlElmt.classList.remove("disabled");
	}
}