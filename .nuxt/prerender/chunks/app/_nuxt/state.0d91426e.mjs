import { d as defineStore } from '../server.mjs';
import * as BABYLON from 'file:///Users/guillaumequet/code/perso/alexGD_website_nuxtjs/website/node_modules/babylonjs/babylon.js';

function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}
const useStateStore = defineStore("StateStore", {
  state: () => ({
    texEmissive: [],
    canvas: null,
    engine: null,
    scene: null,
    obj3d: null,
    progress: 0,
    log: [],
    isLoading: true,
    baseUrl: "https://raw.githubusercontent.com/0000rgb124/rgb124.github.io/main/public/"
  }),
  getters: {
    getProgress: (state) => state.progress,
    getIsLoading: (state) => state.isLoading
  },
  actions: {
    setCanvas(ref) {
      this.canvas = ref;
    },
    setEngine() {
      this.engine = new BABYLON.Engine(this.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      });
      this.scene = new BABYLON.Scene(this.engine);
    },
    loadAssets() {
      const assetsManager = new BABYLON.AssetsManager(this.scene);
      assetsManager.onProgress = (remainingCount, totalCount, lastFinishedTask) => {
        this.progress = scaleBetween(remainingCount, 0, 100, totalCount, 0);
      };
      const log = this.log;
      assetsManager.onTaskSuccessObservable.add(function(task) {
        log.unshift(task.name);
        log.unshift();
      });
      for (let i = 0; i < 76; i++) {
        const emissiveTexUrl = `${this.baseUrl}texture/emissive/Emission_v2_000${i.toString().padStart(2, "0")}.jpg`;
        this.texEmissive[i] = assetsManager.addTextureTask(
          "Emission_v2_000" + i.toString().padStart(2, "0") + ".jpg",
          emissiveTexUrl
        );
      }
      const obj3dUrl = this.baseUrl + "modelinglogo2.obj";
      console.log(obj3dUrl);
      this.obj3d = assetsManager.addMeshTask(
        "modelinglogo2.obj",
        ["fleche_up", "cube_center", "fleche_down"],
        obj3dUrl
      );
      assetsManager.load();
      assetsManager.onFinish = () => {
        this.isLoading = false;
        BABYLON.MeshBuilder.CreateBox("box", {});
        const camera = new BABYLON.ArcRotateCamera(
          "Camera",
          0.75,
          1.25,
          8,
          BABYLON.Vector3.Zero(),
          this.scene
        );
        camera.attachControl(this.canvas, false);
        camera.useAutoRotationBehavior = true;
        camera.lowerRadiusLimit = 4;
        camera.upperRadiusLimit = 15;
        const light = new BABYLON.HemisphericLight(
          "light",
          new BABYLON.Vector3(1, 1, 0),
          this.scene
        );
        light.intensity = 0.25;
        this.scene.clearColor = new BABYLON.Color3(1, 1, 1);
        this.engine.runRenderLoop(() => {
          this.scene.render();
        });
      };
    }
  }
});

export { useStateStore as u };
//# sourceMappingURL=state.0d91426e.mjs.map
