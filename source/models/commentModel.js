class Comment{
    constructor (comment){
        this.userID = comment.userID;
        this.nameOfUser = comment.nameOfUser
        const d = new Date();
        const t = d.getTime()
        this.dateComment = t
        this.postID = comment.postID;
        this.cmt = comment.cmt;
    }
}

module.exports = Comment;