const bcrypt = require('bcryptjs');
// Return hash
const Encrypt = password => new Promise((res, rej) => {
    bcrypt.hash(
        password,
        bcrypt.genSaltSync(Math.floor(Math.random * 11)), (err, hash) => {
            if (err) reject(err)
            res(hash)
        })
})
// Return boolean wheter password is equal to hash or not
const Compare = (password, hash) => bcrypt.compareSync(password, hash);
// Object exported
const Crypto = {
    Encrypt,
    Compare
}
module.exports = Crypto;