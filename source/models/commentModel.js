class Comment{
<<<<<<< HEAD
    constructor (comment){
        this.userID = comment.userID;
        this.nameOfUser = comment.nameOfUser
        const d = new Date();
        const t = d.getTime()
        this.dateComment = t
        this.postID = comment.postID;
        this.cmt = comment.cmt;
=======
    constructor (userID,profilePicture, nameOfUser, dateComment, postID, cmt){
        this.userID = userID;
        this.profilePicture = profilePicture;
        this.nameOfUser = nameOfUser;
        this.dateComment = dateComment;
        this.postID = postID;
        this.cmt = cmt;
>>>>>>> 0b71cb353ffe52bf954b1cb5fae93ca4f137dc7e
    }
}

module.exports = Comment;