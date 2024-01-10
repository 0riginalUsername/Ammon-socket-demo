import {DataTypes, Model } from 'sequelize'
import util from 'util'
import connectToDB from './db.js'

export const db = await connectToDB('postgresql:///CAH')

export class User extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}
export class Room extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

User.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: "users",
        sequelize: db
    }
)

Room.init(
    {
        roomId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
            
        },
        roomKey: {
            type: DataTypes.STRING(6),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(26),
            allowNull: true,
            unique: false
        },
        host: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        
        
        

    },{
        modelName: "rooms",
        sequelize: db
    }
    
)
User.belongsToMany(Room, {through: "players"})
Room.belongsToMany(User, {through: "players"})