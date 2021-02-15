const { Parcel } = require('../models/parcel.model');

const fs = require('fs');

module.exports = {
    getAll: async (req,res) => {
        const parcels = await Parcel.find();
        parcels.forEach((el)=>{
            if(el.photo){
                el.photo = "http://localhost:3000/images/"+el.image
            }
        })
        res.json(parcels)
    },

    showCreate: async (req,res) => {
        res.render('create');
   
    }, 

    create: async (req,res)=>{
      
        const {  
            dimension,
            weight,
            parcelType,
            bonus,
            description,
                } = req.body;
               
               /* const userExist = await User.findOne({ 'email' : email });
                if(userExist){
                    return res.status(400).json("Already registred email");
                }
                const salt = await bcrypt.genSalt(8);
                const hashPassword = await bcrypt.hash(password, salt);*/
        

        const parcel = new Parcel({
            dimension,
            weight,
            parcelType,
            bonus,
            description,
        });

        if(req.file){
            parcel.photo = req.file.filename;
        }
        await parcel.save();
        res.json(parcel)
       // res.redirect('/users');
    }, 
    updateParcel: async (req, res)=>{
        const { id } = req.params;

        const parcel = await Parcel.findOne({ _id: id });
        if(!parcel){
            return res.status(404).json("User Not Found")
        }

        const {
            dimension,
            weight,            
            bonus,
            description,       
        } = req.body;


        parcel.dimension = dimension;
        parcel.weight = weight;
        parcel.bonus= bonus;
        parcel.description = description;
       

        if(req.file){
            if(parcel.photo){
                fs.unlink("./public/images/"+parcel.photo, (err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            }
            parcel.photo = req.file.filename;
        }

        await parcel.save();
        res.json(parcel)

    },
}