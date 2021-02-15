

const { User } = require('../models/user.model');
const { Advertisement } = require('../models/advertisement.model');
module.exports = {
    

    create: async (req,res , next)=>{
        
        
        const advert = new Advertisement({
            departureDate: req.body.departureDate,
            arivalDate : req.body.arivalDate, 
            departure: req.body.departure ,
            destination: req.body.destination ,
            descriptionBuying: req.body.descriptionBuying,
            createdBy: req.body.createdBy,
            parcel: req.body.parcel
         
        });
        console.log(req.body.parcel);
        await advert.save();
        const user = await User.findById({_id: advert.createdBy})
        user.publishedAdverts.push(advert);
        await user.save();
        res.json(advert)
       // res.redirect('/users');
    },
    getAll: async (req,res) => {
        const advert = await Advertisement.find().populate('createdBy' , "lastName firstName image").populate('parcel');
       /* users.forEach((el)=>{
            if(el.image){
                el.image = "http://localhost:3000/images/"+el.image
            }
        })*/
        res.json(advert)
    },
    updateAds: async (req, res)=>{
        const { id } = req.params;

 
        const advert = await Advertisement.findOne({ _id: id });
        if(!advert){
            return res.status(404).json(" Advertisement Not Found")
        }
       
         const { departureDate,arivalDate,departure ,destination,descriptionBuying } = req.body;
  
        
            advert.departureDate = departureDate,
            advert.advetarivalDate = arivalDate, 
            advert.departure = departure ,
            advert.destination = destination ,
         advert.descriptionBuying = descriptionBuying,
       
    
        await advert.save();
        res.json(advert)


    }
 }