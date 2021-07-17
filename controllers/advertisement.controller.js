
const fetch = require("node-fetch");
const { User } = require('../models/user.model');
const { Advertisement } = require('../models/advertisement.model');
module.exports = {

    create: async (req, res, next) => {


        const advert = new Advertisement({
            type: req.body.type,
            departureDate: req.body.departureDate,
            arivalDate: req.body.arivalDate,
            departure: req.body.departure,
            destination: req.body.destination,
            createdBy: req.body.createdBy,
            parcel: req.body.parcel,
            place:""

        });

        /* Saving pictures of places */
        var place = advert.destination;
        var photo = {
          id: "0",
          owner: "0",
          secret: "0",
          server: "0",
          farm: 0
        }
        var generateUrl = ""
        const imagesUrl = "http://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=b8055c22c0471b9cf5cb95e82e5f4511&privacy_filter=public&media=photos&page=1&format=json&safe_search=1&nojsoncallback=1&tags=travel%2Cmonument&text=" + place
        fetch(imagesUrl).then(async response => {
          try {
            const data = await response.json()
    
            if (data.photos != null) {
              photo = data.photos.photo[0]
              generateUrl = "http://farm" + photo.farm.toString() + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
              advert.place = generateUrl
              await advert.save();
              res.json(advert)
              console.log(generateUrl)
             }
             else{
             await advert.save();
             res.json(advert)
             }
    
    
          } catch (error) {
            console.log('Error in photos api happened !')
            console.error(error)
          }
        })
        /* Saving pictures of places */
        
        const user = await User.findById({ _id: advert.createdBy })
        user.publishedAdverts.push(advert);
        await user.save();
        
         
    },
    getFlights: async (req, res) => {
        const advert = await Advertisement.find({type: "travel"}).populate('createdBy', "lastName firstName image");
        
        res.status(200).json({ flights: advert });
    },
    getAll: async (req, res) => {
        const advert = await Advertisement.find({$or:[{type: "purchase"},{type:"transport"}]}).populate('createdBy', "lastName firstName image").populate('parcel');
    
        res.status(200).json({ ads: advert });
    },

    updateAds: async (req, res) => {
        const { id } = req.params;


        const advert = await Advertisement.findOne({ _id: id });
        if (!advert) {
            return res.status(404).json(" Advertisement Not Found")
        }

        const { departureDate, arivalDate, departure, destination  } = req.body;


        advert.departureDate = departureDate,
            advert.advetarivalDate = arivalDate,
            advert.departure = departure,
            advert.destination = destination, 


            await advert.save();
        res.json(advert)


    },
    showAdvert: async (req, res) => {
        const { id } = req.params;
        const advert = await Advertisement.findOne({ _id: id }).populate('createdBy', "lastName firstName image").populate('parcel');
        if (!advert) {
            return res.status(404).json("Advertisement not found");
        }

        res.json(advert)
    },
    searchFlights: async (req, res, next) => {

        const dest = req.body.destination;
        const dep = req.body.departure;
        const date = req.body.date;




        try {
            const flights = await Advertisement.find({ type: "travel", destination: dest, departureDate: date, departure: dep }).populate('createdBy', "lastName firstName image")
            if (flights.length > 0)
                res.status(200).json({ flights: flights });
            else res.status(404).json("No flights found");
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    searchFlightsDateFilter: async (req, res, next) => {
 
        const depDate = req.body.departureDate;
        const arrDate = req.body.arivalDate;
        const dep = req.body.departure;
        const dest = req.body.destination;
         
        try {
            const flights = await Advertisement.find({ type: "travel", departureDate: depDate, arivalDate: arrDate,departure:dep,destination:dest }).populate('createdBy', "lastName firstName image")
            if (flights.length > 0)
                res.status(200).json({ flights: flights });
            else res.status(404).json("No flights found");
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    searchAdvert : async (req ,res ,next) => {
        const depDate = req.body.departureDate ;
        const arrDate = req.body.arivalDate;
        const dep = req.body.departure;
        const dest = req.body.destination
        try {
            const ads = await Advertisement.find({$or:[{type: "purchase"},{type:"transport"}], departureDate: depDate, arivalDate: arrDate,departure:dep,destination:dest }).populate('createdBy', "lastName firstName image").populate('parcel')
            if (ads.length > 0)
                res.status(200).json({ ads: ads });
            else res.status(404).json("No Ads found");
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },

    showUpcomingFlights: async (req, res, next) => {
        try {
            const flights = await Advertisement.find({departureDate: { $gte: Date.now() },type:"travel" }).populate('createdBy', "lastName firstName image")

            if (flights.length > 0)
                res.status(200).json({ flights: flights });
            else res.status(404).json("No flights found");

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },

    showTopFlights: async (req, res, next) => {
        try {
            const flights = await Advertisement.aggregate([

                { $unwind: "$destination" },
                { $unwind: "$departure" },
                { $sortByCount: { $concat: ["$destination", "-", "$departure","-","$place"] } },
                 


            ])
            var topFlights = [];



            flights.forEach((e) => {
                if (e._id) {
                    const separator = e._id.split("-")
                    const destination = separator[0]
                    const departure = separator[1]
                    const place = separator[2]
                    const count = e.count

                    topFlights.push({ departure: departure, destination: destination, count: count,place:place });

                }

            })


            if (flights.length > 0)
                res.status(200).json({ flights: topFlights })

            else res.status(404).json("No flights found ! ");

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    },
    showMyAds: async (req, res,next) => {
        const { id } = req.params;
         
        try {
            const ads = await Advertisement.find({ $or:[{type: "purchase"},{type:"transport"}], createdBy: id  }).populate("createdBy")
            if (ads.length > 0)
                res.status(200).json({ ads: ads });
            else res.status(404).json("No Ads found");
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }

}