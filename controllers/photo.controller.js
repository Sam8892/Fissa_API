const http = require("http")



module.exports = {
    getPhoto: async (req, res) => {

      res.status(200).json("Working on photo api")
/*
        const place = req.body.place;
        const url = "http://api.teleport.org/api/urban_areas/slug:" + place + "/images/"
        


        console.log(url)

        http.get(url, output => {
            let data = ""
          
            output.on("data", d => {
              data += d
            })
            output.on("end", () => {
                res.json(JSON.parse(data))
            })
          })

*/

    }
}