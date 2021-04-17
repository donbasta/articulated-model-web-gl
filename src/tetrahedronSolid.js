const baseValue = 100;
const tetrahedronSolid = {
    positions: [
        -baseValue, -baseValue, -baseValue,
        baseValue, -baseValue, -baseValue,
        0, 0, baseValue,
        baseValue, -baseValue, -baseValue,
        baseValue, baseValue, -baseValue,
        0, 0, baseValue,
        baseValue, baseValue, -baseValue,
        -baseValue, baseValue, -baseValue,
        0, 0, baseValue,
        -baseValue, baseValue, -baseValue,
        -baseValue, -baseValue, -baseValue,
        0, 0, baseValue,
        baseValue, -baseValue, -baseValue,
        -baseValue, -baseValue, -baseValue,
        -baseValue, baseValue, -baseValue,
        baseValue, -baseValue, -baseValue,
        -baseValue, baseValue, -baseValue,
        baseValue, baseValue, -baseValue
    ],
    colors: [
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,
        1.0,  0.0,  0.0,  1.0,
        1.0,  0.0,  0.0,  1.0,
        1.0,  0.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  1.0,  0.0,  1.0,
        0.0,  0.0,  1.0,  1.0,
        0.0,  0.0,  1.0,  1.0,
        0.0,  0.0,  1.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
        1.0,  1.0,  0.0,  1.0,
    ]
}

export default tetrahedronSolid;