function Constants() {
    return {
        sock: {
            cmd: 'command',
            ver: 'verify',
            ins: 'instant',
            qed: 'queued',
            chat: 'chat',
            svr: 'server'
        },
        errors: {
            dupCmdErr: 'Duplicate command key detected.'
        }
    };
}

module.exports = Constants();