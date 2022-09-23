import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default class Figure {
  constructor(scene, offset) {
    this.$image = document.querySelector(".tile__image");
    this.scene = scene;

    this.loader = new THREE.TextureLoader();

    this.image = this.loader.load(this.$image.dataset.src);
    this.hoverImage = this.loader.load(this.$image.dataset.hover);
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = offset;

    this.mouse = new THREE.Vector2(0, 0);
    window.addEventListener("mousemove", (ev) => {
      this.onMouseMove(ev);
    });

    this.getSizes();
    this.createMesh();
  }

  getSizes() {
    const { width, height, top, left } = this.$image.getBoundingClientRect();

    // Get sizes of object in pixel to use as dimension scale in 3D scene
    this.sizes.set(width, height);

    // Calculate object's coord in 3D scene
    this.offset.set(
      this.offset.x + left - window.innerWidth / 2 + width / 2,
      this.offset.y + -top + window.innerHeight / 2 - height / 2
    );
  }

  createMesh() {
    // Shader material
    this.uniforms = {
      // Uniform type reference: https://gist.github.com/williamsiuhang/9e6d5060312ea8e5a9f0206379acadf3
      u_image: { type: "t", value: this.image },
      u_imagehover: { type: "t", value: this.hoverImage },
      u_mouse: { value: this.mouse },
      u_time: { value: 0 },
      u_res: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    this.geometry = new THREE.PlaneBufferGeometry(0.5, 1, 1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      defines: {
        pixelRatio: window.devicePixelRatio.toFixed(1),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    this.scene.add(this.mesh);
  }

  onMouseMove(event) {
    gsap.to(this.mouse, {
      x: event.clientX,
      y: event.clientY,
    });

    gsap.to(this.mesh.rotation, 0.5, {
      x: (this.mouse.y - window.innerHeight / 2) * 0.0003,
      y: (this.mouse.x - window.innerWidth / 2) * (Math.PI / 6) * 0.001,
    });
  }

  update() {
    this.uniforms.u_time.value += 0.01;
  }
}
