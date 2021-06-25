const d = new Date();
class User {
    constructor (user){
        this.userName = user.userName; // only one
        this.passWord = user.passWord; // can change
        this.profilePicture = user.profilePicture; // can chage
        this.permission = 0; // only admin can be change
        this.gmail = user.gmail; // cant change
        this.phoneNumber = user.phoneNumber; // cant change
        this.dayOfBirth = user.dayOfBirth; // can't change
        this.dayInit = d.getTime(); // milisec
        this.dayInitPremeum = d.getTime();  // milisec
        this.dayEndPremeum = d.getTime() + 7 * 24 * 60 * 60 * 1000;    // milisec
        this.nameOfUser = user.nameOfUser; // can change
        this.nickName = user.nickName; // only one can't change
        this.confirmation = false; // only admin can be change
    }

    set confirm(x){
        this.confirmation = x;
    }
    
    set dayEnd(x){
        this.dayEndPremeum = x;
    }

    set Permission(x){
        this.permission = x;
    }
}

module.exports = User;
