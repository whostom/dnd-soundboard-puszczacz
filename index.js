const { spawn, exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const io = require('socket.io-client')

const socket = io('http://192.168.68.173:3000')

function setVolume(percent) {
    return new Promise((resolve, reject) => {
        exec(`amixer -c 0 sset 'SpotifyDupa123' ${percent}%`, (err,stdout,stderr) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

socket.on('connect', () => {
    console.log('Connected to Socket.IO server')
})

socket.on('play-sound', async (fileName) => {
    const filePath = `/mnt/dnd-soundboard/sounds/${fileName}`
    const ext = path.extname(fileName).toLowerCase()

    if (!fs.existsSync(filePath)) {
        console.error('Sound file not found:', filePath)
        return
    }

    try {
        console.log('Lowering volume to 50%')
        await setVolume(50)

        let player
        if (ext === '.mp3')
            player = spawn('/usr/bin/mpg123', ['-o', 'alsa', '-a', 'default_no_softvol', filePath])
        else if (ext === '.wav')
            player = spawn('/usr/bin/aplay', ['-D', 'default', filePath])
        else
            throw new Error(`Unsupported file extension: ${ext}`)

        player.on('error', (err) => {
            console.error('Playback error:', err.message)
        })

        player.on('close', async (code) => {
            if (code === 0) {
                console.log(`${ext.toUpperCase().slice(1)} played successfully:`, fileName)
            } else {
                console.warn(`Player exited with code ${code} for file:`, fileName)
            }

            console.log('Restoring volume to 100%')
            await setVolume(100)
        })

    } catch (err) {
        console.error('Error:', err.message)
        await setVolume(100)
    }
})
