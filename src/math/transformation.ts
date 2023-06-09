import Matrix from "./matrix";
import Vector from "./vector";
import Quaternion from "./quaternion";

export interface Transformation {
  getMatrix(): Matrix;
  getInverseMatrix(): Matrix;
  toJSON(): any;
}

class MatrixTransformation implements Transformation {
  matrix: Matrix;
  inverse: Matrix;

  constructor(matrix: Matrix, inverse: Matrix) {
    this.matrix = matrix;
    this.inverse = inverse;
  }

  getMatrix(): Matrix {
    return this.matrix;
  }

  getInverseMatrix(): Matrix {
    return this.inverse;
  }
  toJSON() {
    let transform;
    if (this instanceof Translation) {
      transform = {
        Translation: {
          matrix: this.matrix.toJSON(),
          inverse: this.inverse.toJSON(),
        },
      };
    } else if (this instanceof Rotation) {
      transform = {
        Rotation: {
          matrix: this.matrix.toJSON(),
          inverse: this.inverse.toJSON(),
        },
      };
    } else if (this instanceof Scaling) {
      transform = {
        Scaling: {
          matrix: this.matrix.toJSON(),
          inverse: this.inverse.toJSON(),
        },
      };
    }
    return transform;
  }
}

export class Translation extends MatrixTransformation {
  private _translationVector: Vector;
  constructor(translation: Vector) {
    super(
      Matrix.translation(translation),
      Matrix.translation(translation.mul(-1))
    );
    this._translationVector = translation;
  }

  set translationVector(tranlation: Vector) {
    this._translationVector = tranlation;
    this.recalculate();
  }

  private recalculate() {
    this.matrix = Matrix.translation(this._translationVector);
    this.inverse = Matrix.translation(this._translationVector.mul(-1)); //nicht sicher aber muss inverse sein
  }
}

export class Rotation extends MatrixTransformation {
  private _axis: Vector;
  private _angle: number;

  constructor(axis: Vector, angle: number) {
    super(Matrix.rotation(axis, angle), Matrix.rotation(axis, -angle));
    this._axis = axis;
    this._angle = angle;
  }

  set axis(axis: Vector) {
    this._axis = axis;
    this.recalculate();
  }

  set angle(angle: number) {
    this._angle = angle;
    this.recalculate();
  }

  private recalculate() {
    this.matrix = Matrix.rotation(this._axis, this._angle);
    this.inverse = Matrix.rotation(this._axis, -this._angle);
  }
}

export class Scaling extends MatrixTransformation {
  private _scaleVector: Vector;
  constructor(scale: Vector) {
    super(
      Matrix.scaling(scale),
      Matrix.scaling(new Vector(1 / scale.x, 1 / scale.y, 1 / scale.z, 0))
    );
    this._scaleVector = scale;
  }

  set scale(scale: Vector) {
    this._scaleVector = scale;
    this.recalculate();
  }

  private recalculate() {
    this.matrix = Matrix.scaling(this._scaleVector);
    this.inverse = Matrix.scaling(this._scaleVector.mul(-1)); //siehe translation inverse
  }
}

export class SQT extends MatrixTransformation {
  scale: Vector;
  quaternion: Quaternion;
  translation: Vector;

  constructor(
    scale: Vector,
    rotation: { angle: number; axis: Vector },
    translation: Vector
  ) {
    super(Matrix.identity(), Matrix.identity());
    this.scale = scale;
    this.translation = translation;
    this.quaternion = Quaternion.fromAxisAngle(rotation.axis, rotation.angle);
    this.recalculate();
  }

  set rotation(q: Quaternion) {
    this.quaternion = q;
    this.recalculate();
  }

  private recalculate() {
    this.matrix = Matrix.translation(this.translation)
      .mul(this.quaternion.toMatrix())
      .mul(Matrix.scaling(this.scale));
    this.inverse = Matrix.scaling(
      new Vector(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z, 0)
    )
      .mul(this.quaternion.inverse.toMatrix())
      .mul(Matrix.translation(this.translation.mul(-1)));
  }
}
