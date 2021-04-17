export default class GLObject {
    constructor(model) {
        const {positions, colors} = model;
        this.positions = positions;
        this.colors = colors;
    }
}