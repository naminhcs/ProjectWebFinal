
class Post{
    constructor (post){
        const d = new Date(post.dateUpload)
        this.title = post.title;
        this.dateUpload = d.getTime();
        this.summary = post.summary;
        this.permission = post.permission;
        this.listTag = post.listTag;
        this.urlPic = 'default';
        this.category2 = post.category2;
        this.category1 = post.category1;
        this.content = 'hi cái này là test thôi';
        this.view = Math.floor(Math.random() * 1000001);
    }
}


module.exports = Post;