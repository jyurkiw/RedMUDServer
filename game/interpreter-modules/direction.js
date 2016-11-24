/**
 * Direction command dictionary.
 * Runs at priority 0 (highest).
 * Takes zero arguments (will consume zero additional command words).
 * 
 * @returns An access object.
 */
function Direction() {
    var north = 'north';
    var south = 'south';
    var east = 'east';
    var west = 'west';
    var northwest = 'northwest';
    var northeast = 'northeast';
    var southeast = 'southeast';
    var southwest = 'southwest';

    return {
        commands: {
            n: north,
            s: south,
            e: east,
            w: west,
            nw: northwest,
            ne: northeast,
            sw: southwest,
            se: southeast,
            north: north,
            south: south,
            east: east,
            west: west,
            northwest: northwest,
            northeast: northeast,
            southwest: southwest,
            southeast: southeast
        },
        priority: 0
    };
}

module.exports = Direction();