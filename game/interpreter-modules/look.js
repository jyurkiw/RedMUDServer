function Look() {
    var look = 'look';

    return {
        commands: {
            l: look,
            look: look
        },
        priority: 0
    };
}

module.exports = Look();