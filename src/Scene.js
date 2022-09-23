import * as THREE from "three";
import Figure from "./Figure";

const perspective = 800;

export default class Scene {
  constructor() {
    this.container = document.getElementById("stage");

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      alpha: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.initLights();
    this.initCamera();

    // Add figure
    this.figures = [
      new Figure(this.scene, new THREE.Vector2(-300, 0)),
      new Figure(this.scene, new THREE.Vector2(300, 0)),
    ];

    this.update();
  }

  initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientlight);
  }

  initCamera() {
    const fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;

    console.log("Perspective", perspective);

    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, perspective);
  }

  update() {
    requestAnimationFrame(this.update.bind(this));

    this.figures.forEach((figure) => figure.update());

    this.renderer.render(this.scene, this.camera);
  }
}
