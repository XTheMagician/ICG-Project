import {
  GroupNode,
  SphereNode,
  AABoxNode,
  TextureBoxNode,
  PyramidNode,
  CustomShapeNode,
  CameraNode,
  LightNode,
  TextureVideoBoxNode,
  TextureTextBoxNode,
} from "./nodes";

export default interface Visitor {
  visitGroupNode(node: GroupNode): void;
  visitSphereNode(node: SphereNode): void;
  visitAABoxNode(node: AABoxNode): void;
  visitPyramidNode(node: PyramidNode): void;
  visitTextureBoxNode(node: TextureBoxNode): void;
  visitTextureVideoBoxNode(node: TextureVideoBoxNode): void;
  visitTextureTextBoxNode(node: TextureTextBoxNode): void;
  visitCameraNode(node: CameraNode): void;
  visitLightNode(node: LightNode): void;
  visitCustomShapeNode(node: CustomShapeNode): void;
}
