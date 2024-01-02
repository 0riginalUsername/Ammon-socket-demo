import {User} from './model.js'


const handlerFunctions = {
    
    login: async(req, res) => {
        console.log('ran');
        const {email, password} = req.body
        const findUser = await User.findOne({
            where: {email: email, password: password}
        })
        if(findUser){
            req.session.userId = findUser.userId
            res.send({success: true})
        }
        else{
            res.send({success: false})
        }
    }
}
export default handlerFunctions