const { Parcel } = require('../models/parcel.model');

const fs = require('fs');

module.exports = {
    getAll: async (req,res) => {
        const parcels = await Parcel.find();
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
            photo} = req.body;
              
        

        const parcel = new Parcel({
            dimension,
            weight,
            parcelType,
            bonus,
            description,
            photo
        });
        /*
        if(req.file){
            parcel.photo = "https://fisaa.herokuapp.com/images/"+req.file.filename;
        }*/
        await parcel.save();
        res.json(parcel)
    }, 
    updateParcel: async (req, res)=>{
        const { id } = req.params;

        const parcel = await Parcel.findOne({ _id: id });
        if(!parcel){
            return res.status(404).json("Parcel Not Found")
        }

        const {
            dimension,
            weight,            
            bonus,
            parcelType,
            description,
            photo       
        } = req.body;

        
        parcel.dimension = dimension;
        parcel.weight = weight;
        parcel.bonus= bonus;
        parcel.parcelType= parcelType;
        parcel.description = description ;
        parcel.photo = photo;
    
       /* if(req.file){
            if(parcel.photo){
                fs.unlink("./public/images/"+parcel.photo, (err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            }
            parcel.photo = req.file.filename;
        }*/

        await parcel.save();
        res.json(parcel)

    },
    showParcel: async (req,res)=>{
        const { id } = req.params;
        const parcel = await Parcel.findOne({ _id: id });
        if(!parcel){
            return res.status(404).json("Parcel not found");
        }
        
        res.json(parcel)
    }
}