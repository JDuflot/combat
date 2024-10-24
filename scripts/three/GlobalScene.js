import * as THREE from "three";
import Loader from "../diverse/Loader.js";
import Character3D from "./Character3D.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import nx from "../../assets/hdri/nx.png";
import ny from "../../assets/hdri/ny.png";
import nz from "../../assets/hdri/nz.png";
import px from "../../assets/hdri/px.png";
import py from "../../assets/hdri/py.png";
import pz from "../../assets/hdri/pz.png";


  export default class GlobalScene {
    constructor({
    game, 
    idCanvas,
    divCanvasCssSelector,
    character,
    gltfCharacters,
    colorLights,
    isOrbitControls, 
    cameraCoordinates = { x: 0, y: 2, z: 6 },
    cameraCoordinatesMobile = { x: 0, y:2, z:6}
    })
    {
    this.game = game;
    this.divCanvas = document.querySelector(divCanvasCssSelector);
    this.idCanvas = idCanvas;
    this.character = character;
    this.gltfCharacters = gltfCharacters;
    this.characters3D = {};
    this.cameraCoordinates = cameraCoordinates;
    this.cameraCoordinatesMobile = cameraCoordinatesMobile;

    this.sizeMobile = 700; 

    this.createScene();
    this.createCamera();
    this.createRenderer(idCanvas);
    
    if(isOrbitControls){
      this.createControls();
      this.addCursonGrabbingOnClick();
    }
    this.createCubeTexture();
    this.loadAsyncResources(divCanvasCssSelector);
    this.createLights(colorLights);
    this.addEventOnResize();
    this.animate();

    }


    async loadAsyncResources(divCanvasCssSelector) {
      this.loader = new Loader(divCanvasCssSelector);
      this.loader.add();
      const texture = await this.createCubeTexture();
      this.createObjects(texture);
    }
    
    createScene() {
      this.scene= new THREE.Scene();

    };
    createRenderer(idCanvas) {
      const canvas = document.getElementById(idCanvas);
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas, 
        alpha : true, 
        antialias : true
      });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      this.setSizeRenderer();
    };

    setSizeRenderer(){
      this.renderer.setSize( this.divCanvas.clientWidth, this.divCanvas.clientHeight );
    }

    createCamera() {
      this.camera = new THREE.PerspectiveCamera(
              50,
              this.getRatio(),
              0.1,
              1000
        );
      if(window.innerWidth < this.sizeMobile){
      this.setCameraPositionMobile();
      }else {
      this.setCameraPosition();
      }
    };

      setCameraPositionMobile(){
      this.camera.position.z = this.cameraCoordinatesMobile.z;
      this.camera.position.y = this.cameraCoordinatesMobile.y;
      this.camera.position.x = this.cameraCoordinatesMobile.x;
    }
    setCameraPosition(){
    this.camera.position.z = this.cameraCoordinates.z;
    this.camera.position.y = this.cameraCoordinates.y;
    this.camera.position.x = this.cameraCoordinates.x;
  }

    getRatio(){
      return this.divCanvas.clientWidth / (this.divCanvas.clientHeight);
    }

    createControls(){
      const controls = new OrbitControls( this.camera, this.renderer.domElement);
      controls.enableZoom = false;
      controls.target.set(0, 2.5, 0);
      controls.update();

    }

    createCubeTexture(){
      return new Promise((resolve, reject) => {
      const cubeTextureLoader = new THREE.CubeTextureLoader();
      cubeTextureLoader
      .load([
        px,
        nx,
        py,
        ny,
        pz,
        nz
      ], (texture) => {
        resolve(texture);
      })
    });
  }
  
    createLights(colorLights){
      const ambientLight = new THREE.AmbientLight(0xf7eb7e, 0.2); 

      const pointLight = new THREE.PointLight(0xfcfbf2, 10, 100);
      pointLight.position.set(2, 5, 3)
      const pointLight2 = new THREE.PointLight(colorLights, 12, 100);
      pointLight2.position.set(-5, 3, -5)
      const pointLight3 = new THREE.PointLight(0xfcf679, 5, 100);
        pointLight.position.set(2, 5, 3)

      this.scene.add( ambientLight );
      this.scene.add(pointLight);
      this.scene.add(pointLight2);
      this.scene.add(pointLight3);

  };

    createObjects(texture){
      this.objectsLoaded = 0;
      for( let character of this.gltfCharacters){
        this.characters3D[character.name] = new Character3D({
          globalScene: this,
          gltfPath: character.gltf,
          cubeTexture: texture, 
          coordinates: character.coordinates, 
          coordinatesMobile: character.coordinatesMobile, 
          rotation: character.rotation,
          initAnimation: character.initAnimation,
          needChangeColorSaber : character.needChangeColorSaber
      });
      }
  }

  
  
  onceGltfAreLoaded() {
    if (this.gltfCharacters.length === this.objectsLoaded) {
      this.loader.remove();
  
      // Initialisation des personnages après chargement des GLTF
      // console.log("GLTF Loaded, initializing characters...");
      if (this.game) {
        this.game.initializeCharacters(); // Appel à la méthode dans Game.js pour initialiser les personnages
  
        // Activer les boutons après l'initialisation
        this.game.character.activedAllButtons();
      }
    }
  }
  
  




  setPositionsCharacter(){
    for(let key of Object.keys(this.characters3D)){
      if(window.innerWidth < this.sizeMobile){
        this.characters3D[key].setPositionMobileVersion();
      } else {
        this.characters3D[key].setPositionLaptopVersion();
      }
    }
  }

    onResize(event) {
      this.setSizeRenderer();
      this.camera.aspect = this.getRatio();
      this.camera.updateProjectionMatrix();
      if(event.target.innerWidth < this.sizeMobile){
        this.setCameraPositionMobile();
        }else {
        this.setCameraPosition();
      }
      this.setPositionsCharacter();
    }

    addEventOnResize() {
      window.addEventListener("resize", this.onResize.bind(this))
    }

    addCursonGrabbingOnClick() {
      this.renderer.domElement.addEventListener("pointerdown", (event) => {
        event.target.style.cursor = "grabbing";
      });
      this.renderer.domElement.addEventListener("pointerup", (event) => {
        event.target.style.cursor = "grab";
      });
    }


    animate() {
      window.requestAnimationFrame(this.animate.bind(this));

      this.renderer.render(this.scene, this.camera);
    };
  }