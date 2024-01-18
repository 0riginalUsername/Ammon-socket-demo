import {User, Room} from './model.js'

const handlerFunctions = {
    
    login: async(req, res) => {
        const {username, password} = req.body
        const findUser = await User.findOne({
            where: {username: username, password: password}
        })
        

        if(findUser){
            req.session.userId = findUser.userId
            res.send({success: true, userId:findUser.userId })
        }
        else{
            res.send({success: false})
        }
    },
    register: async(req, res) => {
        const {username, password} = req.body
        const findUser = await User.findOne({
            where: {username: username}
        })
        if(findUser){
            res.send({success: false})
        }

        else{
            await User.create({username, password})
            .then((user) => {
                `registered ${user}!`
            })
            .catch((err) => console.log('error: ',err))


            console.log( );
            res.send({success: true})   
        }
    },
    checkSession: (req, res) => {
        if(!req.session.userId){
            res.send({success:false})
        }
        else{
            res.send({success: true})
        }
    },
    getClients: async(req, res) => {
        const {roomKey} = req.body
        // console.log(req.body);
        const foundRoom = await Room.findOne({
            where: {roomKey: roomKey},
            include: {model:User}
        
        })
        let list = foundRoom.users.map((user) => user)
        console.log(list);
        res.send(list)
    },
    deleteUser: async(req, res) => {
        const {userId} = req.body
        const foundUser = await User.findOne({
            where: {userId}
        })
        User.destroy({
            where: {userId}
        })
        console.log('USER ',foundUser.username,' DELETED!');
    },
    editUser: async(req, res) => {
        const {userId, username, password} = req.body
        const foundUser = await User.findOne({
            where: {userId}
        })
        let newUser =  await foundUser.update({username, password})
        console.log('user credentials changesd to ', newUser);
    },
    getRooms: async (req, res) => {
        
        const { userId } = req.body;
        if(!userId){
            return res.send({success: false, allRooms: []})
        }
        else{
        const allRooms = await Room.findAll({
            include: {
                model: User,
                where: { userId: userId }
            }
        });
        // console.log(allRooms);

        console.log(allRooms);
        res.send(allRooms)
    }
    },
    deleteRoom: async(req, res) => {
        console.log(req.body);
    //     const {roomId} = req.body
    //     const foundRoom = await Room.findOne({
    //         where: {roomId}
    //     })
    //     Room.destroy({
    //         where: {roomId}
    //     })
    //     console.log('ROOM ',foundRoom.name,' DELETED!');
    }
    
   
    
}
export default handlerFunctions