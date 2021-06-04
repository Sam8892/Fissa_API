const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
module.exports = {
  
    create: async (req,res , next)=>{
        
        
        const comment = new Comment({
            sender :req.body.sender,
            receiver: req.body.receiver,
            content: req.body.content,
            rate: req.body.rate,
        });
       
        await comment.save();
        //const senderUser = await User.findById({_id: comment.sender })
        const receiverUser = await User.findById({_id: comment.receiver })
       // senderUser.comments.push(comment);
        receiverUser.comments.push(comment);
       // await senderUser.save();
        await receiverUser.save();
        res.json(comment)
       // res.redirect('/users');
    },

}
