/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ronald Capili Student ID: 152344222 Date: 20240309
*
*  Online (Cycliic) Link: https://red-calm-badger.cyclic.app/
*  GitHub: https://github.com/rracapili/assignment4
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
app.use(express.static('public'));
var path = require("path");
// Require the collegeData module from the modules folder
var Data = require('./modules/collegeData');


// setup a 'route' to listen on the default url path
/*
app.get("/", (req, res) => {
    res.send("Hello World!");
});
*/

// Add the express.urlencoded middleware
app.use(express.urlencoded({ extended: true }));

// Call the initialize function before setting up the routes
Data.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serve static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    // Serve the home page directly from the views directory (remove the redirect)
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    });

    // Route for GET /students
    app.get("/students", (req, res) => {
        if (req.query.course) {
            Data.getStudentsByCourse(req.query.course)
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        } else {
            Data.getAllStudents()
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        }
    });
    
    // Route for GET /tas
    app.get("/tas", (req, res) => {
        Data.getTAs()
            .then((tas) => res.json(tas))
            .catch(() => res.json({message: "no results"}));
    });

    // Route for GET /courses
    app.get("/courses", (req, res) => {
        Data.getCourses()
            .then((courses) => res.json(courses))
            .catch(() => res.json({message: "no results"}));
    });

    // Route for GET /student/num
    app.get("/student/:num", (req, res) => {
        const studentNum = req.params.num;
        Data.getStudentByNum(studentNum)
            .then((student) => res.json(student))
            .catch(() => res.json({message: "no results"}));
    });

    // Route for GET /about
    app.get("/about", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'about.html'));
    });

    // Route for GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    });

    // GET route to send the addStudent.html file
    app.get('/students/add', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
    });

    app.post('/students/add', async (req, res) => {
        try {
          // Call addStudent function from collegeData.js module
          await Data.addStudent(req.body);
          // Redirect to the '/students' route upon successful addition
          res.redirect('/students');
        } catch (error) {
          // Handle errors appropriately
          console.error(error);
          // You may want to send an error response or render an error page here
          res.status(500).send('An error occurred while adding the student.');
        }
      });

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, ()=>{console.log("server listening on http://localhost:" + HTTP_PORT)});

}).catch(err => {
    console.error("Failed to initialize data:", err);
});
