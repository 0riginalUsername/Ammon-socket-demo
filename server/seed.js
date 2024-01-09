import {User, db } from './model.js'
import url from 'url'
import util from 'util'

console.log('seeding data...');
await db.sync({ force: true})
const createdUsers = []
for(let i = 1; i < 4; i++){
    createdUsers.push({username: `user${i}`, password: 'test'})
}

const usersInDB = await Promise.all(
    createdUsers.map(user => {
        let newUser = User.create(user)

        return newUser
    })
)
console.log(usersInDB);
if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
    console.log('Syncing database...');
    await db.sync();
    console.log('Finished syncing database!');
  }

await db.close()
console.log("seeding complete");