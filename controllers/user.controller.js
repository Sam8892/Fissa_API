const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const generator = require('generate-password');
/* hello */


module.exports = {
    getAll: async (req, res) => {
        const users = await User.find();
        res.json(users)
    },

    showCreate: async (req, res) => {
        res.render('create');

    },

    create: async (req, res) => {

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

        const userExist = await User.findOne({ 'email': email });

        if (userExist) {
            res.status(400).json("Already registred email");
        }
        else {
            const salt = await bcrypt.genSalt(8);
            const hashPassword = await bcrypt.hash(password, salt);

            /* checking badge */

            var badge = false;

            if (!cin || !phoneNumber) { badge = false }
            else { badge = true }

            /* saving user */

            const user = new User({
                firstName,
                lastName,
                email,
                password: hashPassword,
                dateOfBirth,
                cin,
                description,
                phoneNumber,
                adress,
                zipCode,
                city,
                country
            });
            user.badge = badge

            if (req.file) {
                user.image = "https://fisaa.herokuapp.com/images/" + req.file.filename;
            }
            await user.save();
            res.json(user)
        }


    },


    login: async (req, res) => {

        //add social
        const socialFlag = req.body.social


        if (socialFlag != null && socialFlag == true) {
            let {
                firstName,
                lastName,
                email,
                image,
            } = req.body;
            const user = await User.findOne({ 'email': email })

            if (!user) {

                var password = generator.generate({
                    length: 6,
                    numbers: true
                });
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password,
                    image
                });

                await user.save();

                res.status(200).json({
                    success: true,
                    data: user
                });

            }

            else {
                res.status(200).json({
                    success: true,
                    data: user
                });
            }

        }


        else {

            const data = {
                _id: '',
                firstName: '',
                lastName: '',
                email: '',
                dateOfBirth: '',
                image: '',
                cin: '',
                description: '',
                phoneNumber: '',
                adress: '',
                zipCode: 0,
                city: '',
                country: ''
            }

            User.findOne({ 'email': req.body.email }, (err, user) => {

                if (!user) {
                    res.json({ message: 'Login failed, Email Adress not found' });

                }

                else {
                    //if email is present then it will compare password
                    user.comparePassword(req.body.password, (err, isMatch) => {
                        if (err) throw err;
                        if (!isMatch) return res.status(400).json({
                            message: 'Wrong Password'
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
                            data: user
                        });

                        // console.log(user)
                    })
                }
            })
        }




    },
    // Add image for user
    updateUser: async (req, res) => {


        const { id } = req.params;

        const user = await User.findByIdAndUpdate({ _id: id })

        if (!user) {
            return res.status(404).json("User Not Found")
        }

        const { firstName,
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
            country,
            image


        } = req.body;


        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(password, salt);


        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = hashPassword;
        user.dateOfBirth = dateOfBirth;
        user.cin = cin;
        user.description = description;
        user.phoneNumber = phoneNumber;
        user.adress = adress;
        user.zipCode = zipCode;
        user.city = city;
        user.country = country ;
        user.image = image;

      /*  if (req.file) {
            if (user.image) {
                fs.unlink("./public/images/" + user.image, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            user.image = req.file.filename;
        }*/

        await user.save();
        res.json(user)

    },
    deleteUser: async (req, res) => {
        const { id } = req.params;

        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json("User not found");
        }

        if (user.image) {
            fs.unlink("./public/images/" + user.image, (err) => {
                if (err) {
                    console.log(err)
                }
            });
        }

        await User.findByIdAndDelete(id);
        res.json("User deleted")
    },
    showUSer: async (req, res) => {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json("User not found");
        }
        if (user.image) {
            user.image = user.image;
        }
        res.json(user)
    },
    showMyComments: async (req, res) => {
        const { id } = req.params;

        const user = await User.findOne({ _id: id }).populate({
            path: 'comments',
            model: Comment,
            populate: {
                path: 'sender', select: 'image',
                model: User
            }
        })


        if (!user) {
            return res.status(404).json("No Comments Find");
        }

        res.json({
            Comments: user.comments
        })
    },
    showMyFlights: async (req, res) => {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).populate({ path: 'publishedAdverts', match: { type: "travel" } });
        if (!user) {
            return res.status(404).json("you don't have any flights");
        }
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            publishedAdverts: user.publishedAdverts
        })

    }
}

