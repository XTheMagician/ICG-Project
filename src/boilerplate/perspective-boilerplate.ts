import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
import Vector from "../math/vector";
import { GroupNode, SphereNode, AABoxNode } from "../nodes";
import { RasterVisitor, RasterSetupVisitor } from "../rasterisation/rastervisitor";
import Shader from "../shader/shader";
import perspectiveVertexShader from "../shader/perspective-vertex-shader.glsl";
import fragmentShader from "../shader/basic-fragment-shader.glsl";
import { Scaling, Translation } from "../math/transformation";

window.addEventListener("load", () => {
  const canvas = document.getElementById("rasteriser") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2");

  // construct scene graph
  const sg = new GroupNode(new Scaling(new Vector(0.2, 0.2, 0.2, 0)));
  const gn1 = new GroupNode(new Translation(new Vector(1, 1, 0, 0)));
  sg.add(gn1);
  const sphere = new SphereNode(new Vector(0.8, 0.4, 0.1, 1));
  gn1.add(sphere);
  let gn2 = new GroupNode(new Translation(new Vector(-0.7, -0.4, 0.1, 0)));
  sg.add(gn2);
  const cube = new AABoxNode(new Vector(1, 0, 0, 1));
  gn2.add(cube);

  // setup for rendering
  const setupVisitor = new RasterSetupVisitor(gl);
  setupVisitor.setup(sg);

  const camera = {
    eye: new Vector(-0.5, 0.5, -1, 1),
    center: new Vector(0, 0, 0, 1),
    up: new Vector(0, 1, 0, 0),
    fovy: 60,
    aspect: canvas.width / canvas.height,
    near: 0.1,
    far: 100,
  };
  const shader = new Shader(gl, perspectiveVertexShader, fragmentShader);
  const visitor = new RasterVisitor(gl, shader, null, setupVisitor.objects);

  function animate(timestamp: number) {
    camera.eye = new Vector(Math.cos(timestamp / 1000), 0, Math.sin(timestamp / 1000), 1);
    visitor.render(sg);
    window.requestAnimationFrame(animate);
  }

  shader.load();
  window.requestAnimationFrame(animate);
});
