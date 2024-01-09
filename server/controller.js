import {User} from './model.js'

const handlerFunctions = {
    
    login: async(req, res) => {
        const {username, password} = req.body
        const findUser = await User.findOne({
            where: {username: username, password: password}
        })

        if(findUser){
            req.session.userId = findUser.userId
            
            res.send({success: true})
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
            console.log(`registered ${username}!` );
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
   
    
}
export default handlerFunctions