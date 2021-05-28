const fetch = require("node-fetch");


//JSON.stringify (" a json data from response")  you can use this to display Json in console

module.exports = {
  getPhoto: async (req, res) => {
    var place = req.body.place;
    var photo = {
      id: "0",
      owner: "0",
      secret: "0",
      server: "0",
      farm: 0
    }
    var generateUrl = ""
    const imagesUrl = "http://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=b8055c22c0471b9cf5cb95e82e5f4511&privacy_filter=public&media=photos&page=1&format=json&nojsoncallback=1&tags=city%2Ctravel%2Cmonument%2Ctourist&text=" + place
    fetch(imagesUrl).then(async response => {
      try {
        const data = await response.json()


        if (data.photos != null) {
          photo = data.photos.photo[0]
          generateUrl = "http://farm" + photo.farm.toString() + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
          console.log(generateUrl)
          //res.status(200).json(generateUrl)
        }


      } catch (error) {
        console.log('Error in photos api happened !')
        console.error(error)
      }
    })


  }
}