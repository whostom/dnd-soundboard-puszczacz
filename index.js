const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const io = require('socket.io-client')

const socket = io('http://192.168.68.173:3000', {
    auth: {
        token: 'w20v4qhhcmr355sclv12n6fov' // tu tez poki co brak bezpiecznstwa (poki co) ale ufam ze nikt nie bedzie probowal wejsc na malinke podczas sesji ;)
    }
})

function setVolume(percent) {
    return new Promise((resolve, reject) => {
        exec(`amixer -D softvol sset 'SpotifyDupa123' ${percent}%`, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

socket.on('connect', () => {
    console.log('Connected to Socket.IO server')
})

socket.on('play-sound', (fileName) => {
    console.log("dupa")
    // const filePath = `/mnt/sounds/${fileName}`
    // const ext = path.extname(fileName).toLowerCase()

    // if (!fs.existsSync(filePath)) {
    //     console.error('Sound file not found:', filePath)
    //     return
    // }

    // try {
    //     console.log('Lowering volume to 30%')
    //     await setVolume(30)

    //     let player
    //     if (ext === '.mp3')
    //         player = spawn('mpg123', [filePath])
    //     else if (ext === '.wav')
    //         player = spawn('aplay', [filePath])
    //     else
    //         throw new Error(`Unsupported file extension: ${ext}`)

    //     player.on('error', (err) => {
    //         console.error('Playback error:', err.message)
    //     })

    //     player.on('close', async (code) => {
    //         if (code === 0) {
    //             console.log(`${ext.toUpperCase().slice(1)} played successfully:`, fileName)
    //         } else {
    //             console.warn(`Player exited with code ${code} for file:`, fileName)
    //         }

    //         console.log('Restoring volume to 100%')
    //         await setVolume(100)
    //     })

    // } catch (err) {
    //     console.error('Error:', err.message)
    //     await setVolume(100)
    // }
})
