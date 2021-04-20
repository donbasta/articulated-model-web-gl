import * as mat4 from './math/matrix.js';

export default class GLObject {
    static idStatic = 0;

    static addIdStatic() { this.idStatic = this.idStatic + 1; }

    constructor(model, name, anchorPoint) {
        const {positions, colors, textures, normals, indices} = model;

        this.vertexArray = positions;
        this.colorArray = colors;
        this.textureArray = textures;
        this.normalArray = normals;
        this.indexArray = indices;
        
        this.id = this.constructor.idStatic;
        this.constructor.addIdStatic();
        
        this.name = name;
        this.childs = [];

        this.anchorPoint = anchorPoint;
        this.parentTransformationMatrix = mat4.create();
        this.transformMat = mat4.create();

        this.localProjectionMat = mat4.create();
        this.projectionMat = mat4.create();
    }

    // VertexArray
    setVertexArray(vertexArray) {
        this.vertexArray = vertexArray;
    }

    // set color array
    setColorArray(colorArray) {
        this.colorArray = colorArray;
    }

    // Anchor Point
    setAnchorPoint(anchorPoint) {
        this.anchorPoint = anchorPoint;
    }

    // Set posisiton
    setPosition(x, y, z) {
        this.position = [x, y, z];
        const [a, b, c] = this.anchorPoint;
        this.translateMat3 = mat4.translationMatrix(x + a, y + b, z + c);
    }

    // set Rotation
    setRotation(x, y, z) {
        this.rotation = [x, y, z];
        this.rotateXMat3 = mat4.rotateXMatrix(x);
        this.rotateYMat3 = mat4.rotateYMatrix(y);
        this.rotateZMat3 = mat4.rotateZMatrix(z);
    }

    // Set SCale
    setScale(x, y, z) {
        this.scale = [x, y, z];
        this.scaleMat3 = mat4.scaleMatrix(x, y, z);
    }

    // Add child to tree
    addChild(obj) {
        if (!this.childs.find(x => x.id === obj.id)) {
            this.childs.push(obj);
            obj.setParentAnchorPoint(this.anchorPoint);
            obj.setParentTransformationMatrix(this.calcProjectionMatrix());
        }
    }

    // Set Parent Tranfomation matrix
    setParentTransformationMatrix(transformMat) {
        this.parentTransformationMatrix = transformMat;
    }

    setParentAnchorPoint(anchorPoint) {
        this.parentAnchorPoint = anchorPoint;
    }

    setTransformMat (matrix) {
        this.transformMat = matrix;
    }
    // Translate the object
    translateObj(deltaX, deltaY, deltaZ) {
        this.position = [deltaX, deltaY, deltaZ];
        // const [a, b, c] = this.anchorPoint;
        // this.translateMat3 = mat4.translationMatrix(deltaX + a, deltaY + b, deltaZ + c);
        this.transformChild();
        // this.anchorPoint = mat4.translate(this.anchorPoint, [deltaX, deltaY, deltaZ]);
        // this.transformChild();
    }

    // Rotate the object
    rotateXObj(sudutX) {
        this.rotation = [sudutX, this.rotation[1], this.rotation[2]];
        this.rotateXMat3 = mat4.rotateXMatrix(sudutX);
        this.transformChild();
    }

    rotateYObj(sudutY) {
        this.rotation = [this.rotation[0], sudutY, this.rotation[2]];
        this.rotateYMat3 = mat4.rotateYMatrix(sudutY);
        this.transformChild();
    }

    rotateZObj(sudutZ) {
        this.rotation = [this.rotation[0], this.rotation[1], sudutZ];
        this.rotateZMat3 = mat4.rotateZMatrix(sudutZ);
        this.transformChild();
    }

    rotateObj(sudutX, sudutY, sudutZ) {
        this.rotation = [sudutX, sudutY, sudutZ];
        this.rotateMat3 = mat4.rotateMatrix(sudutX, sudutY, sudutZ);
        this.transformChild();
    }
    
    // scale the object
    scaleObj(scaleX, scaleY, scaleZ) {
        this.scale = [scaleX, scaleY, scaleZ];
    }

    calcProjectionMatrix() {
        const [posX, posY, posZ] = this.position;
        const [anchorPointX, anchorPointY, anchorPointZ] = this.anchorPoint
        const [sudutX, sudutY, sudutZ] = this.rotation;
        const [scaleX, scaleY, scaleZ] = this.scale;

        this.anchorPointmat = mat4.translationMatrix(-anchorPointX, -anchorPointY, -anchorPointZ);
        // console.log("ini di calcProj", sudutX, sudutY, sudutZ)
        this.rotateMat3 = mat4.rotateMatrix(sudutX, sudutY, sudutZ);
        this.translateMat3 = mat4.translationMatrix(posX, posY, posZ);
        this.scaleMat3 = mat4.scaleMatrix(scaleX, scaleY, scaleZ);

        // console.log("ini anchormat\n", this.parentTransformationMatrix)
        return mat4.multiplyMatrices(
            this.parentTransformationMatrix,
            mat4.multiplyMatrices(
                mat4.multiplyMatrices(mat4.multiplyMatrices(this.translateMat3, this.rotateMat3), this.scaleMat3), this.anchorPointmat  
            )
        );
    }
    
    // propagate parent transformation matrix to childs
    transformChild() {
        const proj = this.calcProjectionMatrix();
        for (const obj of this.childs) {
            obj.setParentTransformationMatrix(proj);
            obj.setParentAnchorPoint(this.anchorPoint);
            obj.projectionMat = obj.calcProjectionMatrix();
            obj.transformChild();
        }
    }
}