import {User, Room} from './model.js'
let roomKey = 'SB4HX8'
const foundRoom = await Room.findOne({
    where: {roomKey: roomKey},
    include: {model:User}

})

console.log(foundRoom.users)
    