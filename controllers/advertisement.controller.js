

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
            descriptionBuying: req.body.descriptionBuying,
            createdBy: req.body.createdBy,
            parcel: req.body.parcel

        });
        // console.log(req.body.parcel);
        await advert.save();
        const user = await User.findById({ _id: advert.createdBy })
        user.publishedAdverts.push(advert);
        await user.save();
        res.json(advert)
        // res.redirect('/users');
    },

    getAll: async (req, res) => {
        const advert = await Advertisement.find().populate('createdBy', "lastName firstName image").populate('parcel');
       /* advert.forEach((e) => {
            if (e.departureDate)  {
               var test = new Date(e.departureDate).toISOString().slice(0 , 10)
              e.departureDate = test
                console.log("******" +  e.departureDate) 
                
              //  e.departureDate = new Date().toJSON().slice(0,10);
            }
        })*/
        res.json(advert)
    },

    updateAds: async (req, res) => {
        const { id } = req.params;


        const advert = await Advertisement.findOne({ _id: id });
        if (!advert) {
            return res.status(404).json(" Advertisement Not Found")
        }

        const { departureDate, arivalDate, departure, destination, descriptionBuying } = req.body;


        advert.departureDate = departureDate,
            advert.advetarivalDate = arivalDate,
            advert.departure = departure,
            advert.destination = destination,
            advert.descriptionBuying = descriptionBuying,


            await advert.save();
        res.json(advert)


    },
    showAdvert: async (req, res) => {
        const { id } = req.params;
        const advert = await Advertisement.findOne({ _id: id }).populate('createdBy', "lastName firstName image").populate('parcel');;
        if (!advert) {
            return res.status(404).json("Adverr not found");
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

    showUpcomingFlights: async (req, res, next) => {
        try {
            const flights = await Advertisement.find({
                departureDate: {
                    $gte: Date.now()
                }
            }).populate('createdBy', "lastName firstName image")

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
                { $sortByCount: { $concat: ["$destination", " - ", "$departure"] } }


            ])

            var topFlights = [];



            /** splitting flights done but we can try map */
            flights.forEach((e) => {
                if (e._id) {
                    const separator = e._id.split("-")
                    const dest = separator[0]
                    const dep = separator[1]
                    const count = e.count

                    topFlights.push({  departure: dep, destination: dest, count: count });

                }

            })


            if (flights.length > 0)
                res.status(200).json(topFlights)

            else res.status(404).json("No flights found ! ");

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }

}