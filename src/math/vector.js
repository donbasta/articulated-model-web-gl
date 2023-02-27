export const norm = (vec) => {
    const mag = magnitude(vec);
    return [
        vec[0] / mag,
        vec[1] / mag,
        vec[2] / mag,
    ]
}

const magnitude = (vec) => {
    return Math.sqrt(
        vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]
    );
}
