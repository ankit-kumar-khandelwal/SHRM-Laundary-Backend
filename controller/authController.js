const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

exports.register = async (req, res) => {
    try {
        const { name, email, password,phone } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword,phone });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('Authorization', token).json({ token, user: { id: user._id, name: user.name, email: user.email ,phone:user.phone} });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllUser = async(req,res) => {
    try{
        const result = await User.deleteMany({});
        res.status(200).json({message:'All users deleted Successfully',deletedCount:result.deletedCount});

    }catch(error){
        res.status(500).json(
            {
                message:"Error deleting users",
                error:error.message,
            }
        )
    }
}

