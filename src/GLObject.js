import * as mat4 from './matrix.js';

export default class GLObject {
    static idStatic = 0;

    static addIdStatic() { this.constructor.idStatic++; }

    constructor(model, name) {
        const {positions, colors} = model;
        this.vertexArray = positions;
        this.colorArray = colors;

        this.id = this.constructor.idStatic;
        this.constructor.addIdStatic();
        this.name = name;
        this.childs = [];
        // this.vertexArray = [];
    
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
    }

    // set Rotation
    setRotation(x, y, z) {
        this.rotation = [x, y, z];
    }

    // Set SCale
    setScale(x, y, z) {
        this.scale = [x, y, z];
    }

    // Add child to tree
    addChild(obj) {
        if (!this.childs.find(x => x.id === obj.id)) {
            this.childs.push(obj);
            // obj.setParentAnchorPoint(this.anchorPoint);
            // obj.setParentTransformationMatrix(this.transformMat)
        }
    }

    // Set Parent Tranfomation matrix
    setParentTransformationMatrix(transformMat) {
        this.parentTransformationMatrix = transformMat;
    }

    setProjectionMatrix() {
        let translateMat3, rotateMat3, scaleMat3;
        {
            const [u, v, w] = this.position;
            const [a, b, c] = this.parentAnchorPoint;
            translateMat3 = mat4.translationMatrix(u + a, v + b, w + c);
        }
        {
            const [u, v, w] = this.rotation;
            rotateMat3 = mat4.rotateMatrix(u, v, w);
        }
        {
            const [u, v, w] = this.scale;
            scaleMat3 = mat4.scaleMatrix(u, v, w);
        }
        const localProjectionMat = mat4.multiplyMatrices(
            translateMat3,
            mat4.multiplyMatrices(rotateMat3, scaleMat3)
        )
        const projectionMat = mat4.multiplyMatrices(
            this.parentTransfomationMatrix,
            localProjectionMat
        )
        this.projectionMat = projectionMat;
    }

    // Translate the object
    translateObj(deltaX, deltaY, deltaZ) {
        this.position = mat4.translate(this.position, [deltaX, deltaY, deltaZ]);
        this.anchorPoint = mat4.translate(this.anchorPoint, [deltaX, deltaY, deltaZ]);
    }
    
    // Rotate the object
    rotateObj(sudutX, sudutY, sudutZ) {
        this.rotation = mat4.rotate(this.rotation, [sudutX, sudutY, sudutZ]);
    }
    
    // scale the object
    scaleObj(scaleX, scaleY, scaleZ) {
        this.scale = mat4.scale(this.scale, [scaleX, scaleY, scaleZ]);
    }

    calcProjectionMatrix() {
        return mat4.multiplyMatrices(
            mat4.multiplyMatrices(this.position, this.rotation), this.scale
        );
    }
    
    // Transfer childs
    transformChild() {
        const proj = this.calcProjectionMatrix();
        for (const obj of this.childs) {
            obj.parentTransformationMatrix = [...proj];
            obj.parentAnchorPoint = [
                obj.anchorPoint[0],
                obj.anchorPoint[1],
                obj.anchorPoint[2],
            ]
            obj.projectionMat = obj.calcProjectionMatrix();
            // obj.draw();
        }
    }
}