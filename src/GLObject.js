class GLObject {

    static idStatic = 0;

    static addIdStatic() { this.idStatic++; }

    constructor(name, gl, shaderProgram) {
        this.id = idStatic;
        this.constructor.addIdStatic();
        this.name = name;
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.childs = [];
        this.vertexArray = [];
    
        this.parentTransformationMatrix = identityMatrix();
        this.transformMat = identityMatrix();

        this.localProjectionMat = identityMatrix();
        this.projectionMat = identityMatrix();

        this.sceneDepth = 20;
    }

    // VertexArray
    setVertexArray(vertexArray) {
        this.vertexArray = vertexArray;
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
            obj.setParentAnchorPoint(this.anchorPoint);
            obj.setParentTransformationMatrix(this.transformMat)
        }
    }

    // Set Parent Tranfomation matrix
    setParentTransformationMatrix(transformMat) {
        this.parentTransformationMatrix = transformMat;
    }

    setProjectionMatrix() {
        var [u,v,w];
        {
            [u, v, w] = this.position;
            const [a, b, c] = this.parentAnchorPoint;
            const translateMat3 = translationMatrix(u + a, v + b, w + c);
        }
        {
            [u, v, w] = this.rotation;
            const rotateMat3 = rotateMatrix(u, v, w);
        }
        {
            [u, v, w] = this.scale;
            const scaleMat3 = scaleMatrix(u, v, w);
        }
        const localProjectionMat = multiplyMatrix(
            translateMat3,
            multiplyMatrix(rot3Mat, scaleMat),
        )
        const projectionMat = multiplyMatrix(
            this.parentTransfomationMatrix,
            localProjectionMat
        )
        this.projectionMat = projectionMat;
    }

    // Translate the object
    translateObj(deltaX, deltaY, deltaZ) {
        this.position = translate(this.position, [deltaX, deltaY, deltaZ]);
        this.anchorPoint = translate(this.anchorPoint, [deltax, deltaY, deltaZ]);
    }
    
    // Rotate the object
    rotateObj(sudutX, sudutY, sudutZ) {
        this.rotation = rotate(this.rotation, [sudutX, sudutY, sudutZ]);
    }
    
    // scale the object
    scaleObj(scaleX, scaleY, scaleZ) {
        this.scale = scale(this.scale, [scaleX, scaleY, scaleZ]);
    }

    calcProjectionMatrix() {
        return multiplyMatrices(
            multiplyMatrices(this.position, this.rotation), this.scale
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
            obj.draw();
        }
    }

    bind() {
        const gl = this.gl;
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
    }

    draw() {
        const gl = this.gl;
        
        let vertexPos = gl.getAttributeLocation(this.shaderProgram, 'a_pos');
        let uniformCol = gl.getUniformLocation(this.shaderProgram, 'u_fragColor');
        let uniformPos = gl.getUniformLocation(this.shaderProgram, 'u_proj_mat');
        let uniformRes = gl.getUniformLocation(this.shaderProgram, 'u_resolution');

        // bind position to buffer
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPos);
            gl.vertexAttribPointer(
                vertexPos,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                vertexPos
            );
        }

        // we are using one color per object for now (uniform)
        {
            gl.uniform4fv(
                uniformCol, 
                [1.0, 0.0, 0.0, 1.0] //RED
            );
        }

        // resolution
        {
            gl.uniform3fv(
                uniformRes, 
                [gl.canvas.width, gl.canvas.height, this.sceneDepth]
            )
        }
        
        // projection matrix overall
        gl.uniformMatrix4fv(
            uniformPos, 
            false, 
            this.projectionMat
        );

        // draw
        gl.useProgram(this.shaderProgram);
        {
            const vertexCount = this.vertexArray.length / 3;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }
}