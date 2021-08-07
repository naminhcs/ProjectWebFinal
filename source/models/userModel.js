const d = new Date();
const bcrypt = require('bcryptjs');

class User {
    constructor (user){
        this.userName = user.userName; 
        const hash = bcrypt.hashSync(user.password, 10);
        this.password = hash; 
        this.profilePicture = "https://firebasestorage.googleapis.com/v0/b/web-app-484e0.appspot.com/o/avatar%2Fdefault.png?alt=media&token=42426b0d-ea36-4dc9-90d3-f21217b05e0e"; // can chage
        this.permission = 0; 
        this.gmail = user.gmail; 
        this.phoneNumber = user.phoneNumber; 
        this.dayOfBirth = user.dayOfBirth; 
        this.dayInit = d.getTime(); 
        this.dayInitPremium = d.getTime();  
        this.dayEndPremium = d.getTime() + 7 * 24 * 60 * 60 * 1000; 
        this.nameOfUser = user.nameOfUser; 
        this.nickName = 'default'; 
        this.confirmation = false;
    }
}

module.exports = User;
