export default class PopUp {
	constructor(message, callback) {
			this.message = message;
			this.callback = callback;

			this.create();
			this.addEventOnClickOk();
	}
	create(){
		this.bg = document.createElement("div");
		this.bg.classList.add("pop-up-bg");
		document.body.appendChild(this.bg);

		const div = document.createElement('div');
		div.classList.add("pop-up");
		this.bg.appendChild(div);
		
		const p = document.createElement('p');
		p.textContent = this.message;
		div.appendChild(p);

		this.button = document.createElement('button');
		this.button.textContent = "Ok";
		div.appendChild(this.button);
	}
	addEventOnClickOk(){
		this.button.addEventListener(
			"click",
			() => {
				document.body.removeChild(this.bg);
				this.callback();
		});
	}
}