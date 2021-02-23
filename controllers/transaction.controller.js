const { User } = require('../models/user.model');
const { Transaction } = require('../models/transaction.model');
module.exports = {
    

    create: async (req,res , next)=>{
        
        
        const transaction = new Transaction({
            status :req.body.status,
            sender :req.body.sender,
            traveler: req.body.traveler,
            advert: req.body.advert
        });
       
        await transaction.save();
        const senderUser = await User.findById({_id: transaction.sender })
        const travelerUser = await User.findById({_id: transaction.traveler })
        senderUser.myTransactions.push(transaction);
        travelerUser.myTransactions.push(transaction);
        await senderUser.save();
        await travelerUser.save();
        res.json(transaction)
       // res.redirect('/users');
    },
    getAll: async (req,res) => {
        const transaction = await Transaction.find().populate('sender' , "lastName firstName image").populate('traveler' , "lastName firstName image").populate('advert' , "-_id -__v");  
        res.json(transaction)
    },
    updateTransaction: async (req, res)=>{
        const { id } = req.params;

 
        const transaction  = await Transaction.findOne({ _id: id });
        if(!transaction){
            return res.status(404).json(" transaction Not Found")
        }
       
         const { status,sender,traveler ,advert, } = req.body;
  
        
            transaction.status = status,
            transaction.sendeer  = sender, 
            transaction.traveler = traveler ,
            transaction.advert = advert ,
           
       
    
        await transaction.save();
        res.json(transaction)


    },
    showTransaction: async (req,res)=>{
        const { id } = req.params;
        const transaction = await Transaction.findOne({ _id: id }).populate('sender' , "lastName firstName image").populate('traveler' , "lastName firstName image").populate('advert' , "-_id -__v");
        if(!transaction){
            return res.status(404).json("transaction not found");
        }
        
        res.json(transaction)
    }

}