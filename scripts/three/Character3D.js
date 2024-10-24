import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { degToRad } from "three/src/math/MathUtils.js";
import { degToRad } from "../utils";
import GlobalScene from "./GlobalScene";


export default class Character3D {
    constructor({
      globalScene, 
      gltfPath, 
      cubeTexture, 
      coordinates = { x:0, y:0, z:0},
      coordinatesMobile = { x:0, y:0, z:0},
      rotation = {x:0, y:0, z:0}, 
      initAnimation,
      needChangeColorSaber = false,
    }){
      this.globalScene = globalScene;
      this.coordinates = coordinates;
      this.coordinatesMobile = coordinatesMobile;
      this.rotation = rotation;

      this.animationsAction = {};
      this.initAnimation = initAnimation;
  
      this.clock = new THREE.Clock();

      this.needChangeColorSaber = needChangeColorSaber;

   

      this.importGLTF(gltfPath, cubeTexture);
      this.animate();
    }
    importGLTF(gltfPath, cubeTexture){
      const loader = new GLTFLoader();

      loader.load(gltfPath, (gltf) => {
        this.globalScene.objectsLoaded++;
        this.globalScene.scene.add(gltf.scene);
        this.traverseGltfScene(
          gltf.scene,
          cubeTexture
        );
        this.updateColorSaberWithLocalStorage();



        this.gltf = gltf;

      if(window.innerWidth < this.globalScene.sizeMobile){
        this.setPositionMobileVersion();
      }else{
        this.setPositionLaptopVersion();
      }

        gltf.scene.rotation.y = degToRad(this.rotation.y);

        this.setAnimations(gltf.animations, gltf.scene);

        this.globalScene.onceGltfAreLoaded();
      })
		}

    setPositionMobileVersion(){
      this.gltf.scene.position.x = this.coordinatesMobile.x;
      this.gltf.scene.position.y = this.coordinatesMobile.y;
      this.gltf.scene.position.z = this.coordinatesMobile.z;

    }
    
    setPositionLaptopVersion(){
      this.gltf.scene.position.x = this.coordinates.x;
      this.gltf.scene.position.y = this.coordinates.y;
      this.gltf.scene.position.z = this.coordinates.z;
    }

    traverseGltfScene(sceneGltf, cubeTexture) {
      sceneGltf.traverse((node) => {
        if (node.isMesh) {
          // if (node.name.includes("sabre")) {
          //   this.materialSaber = node.material;
          // }
          if (node.name.includes("sabre")){
            this.materielSaber = node.material;
          }
          node.material.envMap = cubeTexture;
          node.material.envMapIntensity = 0.5;
        }
      });
    }

    updateColorSaber(colorSaber){
      if(colorSaber){
        this.materielSaber.emissive = new THREE.Color(colorSaber);
      }
    }

    updateColorSaberWithLocalStorage(){
      const colorFromStorage = localStorage.getItem('colorSaber');
      if(this.needChangeColorSaber && colorFromStorage){
        this.updateColorSaber(colorFromStorage);
      }
    }

    setAnimations(animationsGltf, sceneGltf) {
      this.mixer = new THREE.AnimationMixer(sceneGltf);
  
      for (let animationClip of animationsGltf) {
        this.animationsAction[animationClip.name] =
          this.mixer.clipAction(animationClip);
        this.animationsAction[animationClip.name].clampWhenFinished = true;
      }
      this.animationsAction[this.initAnimation].play();

      this.currentAction = this.animationsAction[this.initAnimation];
      this.animationsAction[this.initAnimation].play();

    }

    stopAllAnimations(callback){
      this.currentAction.fadeOut(0.1);
      setTimeout(() => {
        for(let animationKey of Object.keys(this.animationsAction)){
          this.animationsAction[animationKey].stop();
        }
        callback();
      }, 100);
    }

    playAnimation(name){
      return new Promise((resolve) => {
        const resetAnimationToBase = () => {
          this.stopAllAnimations(() => {
            this.mixer.removeEventListener('finished', 
              resetAnimationToBase);
            this.currentAction = this.animationsAction[this.initAnimation]
            .setLoop(THREE.LoopRepeat)
            .play();
            resolve();
          });
        }
        this.stopAllAnimations(() => {
          this.mixer.addEventListener('finished', resetAnimationToBase)
          this.currentAction = this.animationsAction[name]
          .setLoop(THREE.LoopOnce)
          .play();
        });
      });
    }



    animate() {
      window.requestAnimationFrame(this.animate.bind(this));
  
      if (this.mixer) {
        const delta = this.clock.getDelta();
        this.mixer.update(delta);
      }
    }
  }
