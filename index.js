const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors(
    {
        origin: 'https://habibur-nabi-arafat.vercel.app',
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],

    }
));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('portfolio');
        const collection = db.collection('authentication');

        // User Registration
        // app.post('/api/v1/register', async (req, res) => {
        //     const { name, email, password } = req.body;

        //     // Check if email already exists
        //     const existingUser = await collection.findOne({ email });
        //     if (existingUser) {
        //         return res.status(400).json({
        //             success: false,
        //             message: 'User already exists'
        //         });
        //     }

        //     // Hash the password
        //     const hashedPassword = await bcrypt.hash(password, 10);

        //     // Insert user into the database
        //     await collection.insertOne({ name, email, password: hashedPassword });

        //     res.status(201).json({
        //         success: true,
        //         message: 'User registered successfully'
        //     });
        // });

        // User Login
        app.post('/api/v1/login', async (req, res) => {
            const { email, password } = req.body;
            console.log(req.body);
            // Find user by email
            const user = await collection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });


        // ==============================================================
        // WRITE YOUR CODE HERE
        // ==============================================================

        //get work experience
        app.get('/api/v1/work-experience', async (req, res) => {
            const workExperience = await db.collection('work-experience').find().toArray();
            res.json(workExperience);
        });
        //add work experience
        app.post('/api/v1/work-experience', async (req, res) => {
            const workExperience = req.body;
            const result = await db.collection('work-experience').insertOne(workExperience);
            res.json(result);
        });
        //get skills
        app.get('/api/v1/skills', async (req, res) => {
            const skills = await db.collection('skills').find().toArray();
            res.json(skills);
        });
        //add skills
        app.post('/api/v1/skills', async (req, res) => {
            const skills = req.body;
            console.log(skills);
            const result = await db.collection('skills').insertOne(skills);
            res.json(result);
        });
        //get learning skills data
        app.get('/api/v1/learning-skills', async (req, res) => {
            const learningSkills = await db.collection('learning-skills').find().toArray();
            res.json(learningSkills);
        });
        //add learning skills data
        app.post('/api/v1/learning-skills', async (req, res) => {
            const learningSkills = req.body;
            const result = await db.collection('learning-skills').insertOne(learningSkills);
            res.json(result);
        });
        //get projects
        app.get('/api/v1/projects', async (req, res) => {
            const projects = await db.collection('projects').find().toArray();
            res.json(projects);
        });
        //add projects
        app.post('/api/v1/projects', async (req, res) => {
            const projects = req.body;
            const result = await db.collection('projects').insertOne(projects);
            res.json(result);
        });
        //get blogs
        app.get('/api/v1/blogs', async (req, res) => {
            const blogs = await db.collection('blogs').find().toArray();
            res.json(blogs);
        });
        //add blogs
        app.post('/api/v1/blogs', async (req, res) => {
            const blogs = req.body;
            const result = await db.collection('blogs').insertOne(blogs);
            res.json(result);
        });
        //get single blog
        app.get('/api/v1/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const blog = await db.collection('blogs').findOne({ _id: id });
            res.json(blog);
        });
        //get recent 3 blogs
        app.get('/api/v1/recent-blogs', async (req, res) => {
            const blogs = await db.collection('blogs').find().sort({ createdAt: -1 }).limit(3).toArray();
            res.json(blogs);
        });



        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});