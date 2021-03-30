const { User } = require('../models/user.model');

const bcrypt = require('bcryptjs');
const fs = require('fs');

module.exports = {
    getAll: async (req,res) => {
        const users = await User.find();
       /* users.forEach((el)=>{
            if(el.image){
                el.image = "http://localhost:3000/images/"+el.image
            }
        })*/
        res.json(users)
    },

    showCreate: async (req,res) => {
        res.render('create');
   
    }, 

    create: async (req,res)=>{
      
        const {  
                firstName,
                 lastName, 
                 email,
                 password, 
                 dateOfBirth,
                 cin,
                 description,
                 phoneNumber,
                 adress,
                 zipCode,
                 city,
                 country   
                } = req.body;
               
                const userExist = await User.findOne({ 'email' : email });
                if(userExist){
                    return res.status(400).json("Already registred email");
                }
                const salt = await bcrypt.genSalt(8);
                const hashPassword = await bcrypt.hash(password, salt);
        

        const user = new User({
            firstName,
            lastName,
            email,
            password : hashPassword,
            dateOfBirth,
            cin,
            description,
            phoneNumber,
            adress,
            zipCode,
            city,
            country 
        });

        if(req.file){
            user.image = req.file.filename;
        }
        await user.save();
        res.json(user)
       // res.redirect('/users');
    }, 

    
    login : async (req ,res  )=> {
        let data = {  
                  id: '',
                firstName: '',
                 lastName:'', 
                 email:'', 
                 dateOfBirth:'',
                 cin:'',
                 description:'',
                 phoneNumber:'',
                 adress:'',
                 zipCode:'',
                 city:'',
                 country:'',
                 image: '' 
                } ;

                 User.findOne({ 'email': req.body.email }, (err, user) => {

                    if (!user){ res.json({message :'Login failed, Email Adress not found'});
                      
                }
  
                    else {
                         //if email is present then it will compare password
                        // console.log(user)
                        user.comparePassword(req.body.password, (err, isMatch) => {
                            if (err) throw err;
                            if (!isMatch) return res.status(400).json({
                                message: 'wrong Password'
                            });
            
                            data.id = user._id;
                            data.firstName = user.firstName;
                            data.lastName = user.lastName;
                            data.email = user.email;
                            data.image = user.image;
                            data.dateOfBirth = user.dateOfBirth;
                            data.cin = user.cin;
                            data.description = user.description;
                            data.phoneNumber = user.phoneNumber;
                            data.adress = user.adress;
                            data.zipCode = user.zipCode;
                            data.city = user.city;
                            data.country = user.country;
            
                            //    return res.status(200).json(data);
                            res.status(200).json({
                                success: true,
                                data
                            });
            
                           // console.log(user)
                        })
                    }
                })
       
    },
    updateUser : async (req, res) =>{

       
       const { id } = req.params;

        const user = await User.findByIdAndUpdate({ _id: id })

        if(!user){
            return res.status(404).json("User Not Found")
        }

        const { firstName,
            lastName,
            email ,
            password,
            dateOfBirth,
            cin,
            description,
            phoneNumber,
            adress,
            zipCode,
            city,
            country
        
        
        } = req.body;


        const salt = await bcrypt.genSalt(8);
                const hashPassword = await bcrypt.hash(password, salt);


        user.firstName = firstName;
        user.lastName = lastName;
        user.email= email;
        user.password= hashPassword;
        user.dateOfBirth= dateOfBirth;
        user.cin = cin;
        user.description = description;
        user.phoneNumber = phoneNumber;
        user.adress = adress;
        user.zipCode = zipCode;
        user.city = city ;
        user.country = country 

        if(req.file){
            if(user.image){
                fs.unlink("./public/images/"+user.image, (err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            }
            user.image = req.file.filename;
        }

        await user.save();
        res.json(user)

    },
    deleteUser: async (req,res)=>{
        const { id } = req.params;

        const user = await User.findOne({ _id: id });
        if(!user){
            return res.status(404).json("User not found");
        }

        if(user.image){
            fs.unlink("./public/images/"+user.image, (err)=>{
                if(err) {
                    console.log(err)
                }
            });
        }

        await User.findByIdAndDelete(id);
        res.json("User deleted")
    },
    showUSer: async (req,res)=>{
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if(!user){
            return res.status(404).json("User not found");
        }
        if(user.image){
            user.image = "http://localhost:3000/images/"+ user.image;
        }
        res.json(user)
    }
}