import "bootstrap";
import "bootstrap/scss/bootstrap.scss";
import Vector from "../math/vector";
import { GroupNode, SphereNode, PyramidNode, AABoxNode } from "../nodes";
import RayVisitor from "../raytracing/rayvisitor";
import { Rotation, Scaling, Translation } from "../math/transformation";

window.addEventListener("load", () => {
  const canvas = document.getElementById("raytracer") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  const sg = new GroupNode(new Translation(new Vector(0, 0, -5, 0)));
  const gnRotation = new Rotation(new Vector(1, 0, 0, 0), 50);
  const gn = new GroupNode(gnRotation);
  sg.add(gn);
  const gn1 = new GroupNode(new Translation(new Vector(1.2, 0.5, 0, 0)));
  gn.add(gn1);
  gn1.add(new AABoxNode(new Vector(0.4, 0, 0, 1)));
  const gn2 = new GroupNode(new Translation(new Vector(-0.8, 1, 1, 0)));
  gn.add(gn2);
  const gn3 = new GroupNode(new Scaling(new Vector(0.4, 0.4, 0.4, 0)));
  gn2.add(gn3);
  gn3.add(new SphereNode(new Vector(0, 0, 0.3, 1)));
  const lightPositions = [new Vector(1, 1, 1, 1)];
  const camera = {
    origin: new Vector(0, 0, 0, 1),
    width: canvas.width,
    height: canvas.height,
    alpha: Math.PI / 3,
  };

  const visitor = new RayVisitor(ctx, canvas.width, canvas.height);

  let animationHandle: number;

  let lastTimestamp = 0;
  let animationTime = 0;
  let animationHasStarted = true;
  function animate(timestamp: number) {
    let deltaT = timestamp - lastTimestamp;
    if (animationHasStarted) {
      deltaT = 0;
      animationHasStarted = false;
    }
    animationTime += deltaT;
    lastTimestamp = timestamp;
    gnRotation.angle = animationTime / 2000;

    visitor.render(sg, camera, lightPositions, {
      ambient: 0.8,
      diffuse: 0.5,
      specular: 0.5,
      shininess: 10,
    });
    // animationHandle = window.requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animationHandle) {
      window.cancelAnimationFrame(animationHandle);
    }
    animationHasStarted = true;
    function animation(t: number) {
      animate(t);
      animationHandle = window.requestAnimationFrame(animation);
    }
    animationHandle = window.requestAnimationFrame(animation);
  }
  animate(0);

  document
    .getElementById("startAnimationBtn")
    .addEventListener("click", startAnimation);
  document
    .getElementById("stopAnimationBtn")
    .addEventListener("click", () => cancelAnimationFrame(animationHandle));
});
