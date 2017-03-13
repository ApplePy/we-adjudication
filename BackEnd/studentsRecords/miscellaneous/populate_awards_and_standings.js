let Students = require('../models/schemas/studentinfo/studentSchema');
let Awards = require('../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');

let doneCounter = 0;

let awardNames = [
    'Excellence in Academia',
    'Making the Difference',
    'Completion',
    'Star Student',
    'Honor Roll',
    'Best in Class',
    'Honors Award',
    'Certified in Life',
    'Certified Smile Maker',
    'Energizer Bunny Award',
    'Money Maker Award',
    'Needle Mover Award',
    'Most Improved',
    'Hard Worker Award',
    'Ember Champion',
    'Mountain Mover',
    'Commitment to Excellence',
    'Commitment to Service',
    'Commitment to Education',
    'Commitment to Kids',
    'Behind the Scenes Award',
    'Top Team',
    'Teamwork Award',
    'Mission Possible Award',
    'Customer Service Award',
    'Pat on the Back Award',
    'Volunteer of the Year',
    'Teacher of the Year',
    'Student of the Year',
    'Student of the Month',
    'You Make the Difference',
    'Shining Star',
    'Certificate of Recognition',
    'Certificate of Achievement',
    'Certificate of Excellence',
    'Certificate of Completion',
    'Academic Star',
    'Perfect Attendance',
    'Responsibility Award',
    'Outstanding Achievement',
    'Rookie of the Year',
    'Outstanding Leadership',
    'Leading By Example',
    'Above & Beyond',
    'Key to Success',
    'Dedicated Service',
    '9001 Years of Service',
    'Helping Hand Award',
    'Caught in the Act of Caring Award',
    'Made My Day Award'
];


// Get all students
Students.find({}).then((students) => {
    // Generate 100 random awards and award to 100 random students

    for (let count = 0; count < 100; count++) {
        let student = students[Math.floor(Math.random() * students.length)];

        let award = new Awards(
            {
                note: awardNames[Math.floor(Math.random() * awardNames.length)],
                recipient: student
            });
        award.save((err) => {
            if (err) throw err;

            console.log("award: " + doneCounter);
            if (++doneCounter >= 200) process.exit(0);
        });
    }
});

let courses = [
    {
        course: 'BASKWEAV 1000',
        description: "Intro to Basket Weaving"
    },
    {
        course: 'SE 3350',
        description: "Software Design"
    },
    {
        course: 'SE 3351',
        description: "Project Management"
    },
    {
        course: 'SE 2250',
        description: "Intro to Basket Weaving"
    },
    {
        course: 'SE 2203',
        description: "Software Design"
    },
    {
        course: 'SE 2205',
        description: "Algorithms"
    },
    {
        course: 'ECE 3375',
        description: "Microprocessors"
    },
    {
        course: 'SE 3314',
        description: "Network Applications"
    },
    {
        course: 'SE 3310',
        description: "Theory of Computing"
    },
    {
        course: 'SE 3353',
        description: "HCI"
    },
];

let fromData = [
    'UBC',
    'Brock',
    'Harvard',
    'MIT',
    'Stanford',
    'UoT',
    'Waterloo',
    'Laurier',
    'Ottawa',
    'McMaster',
    'Guelph',
    'Windsor'
];


// Get all students
Students.find({}).then((students) => {
    // Generate 100 random advanced standings and award to 100 random students

    for (let count = 0; count < 100; count++) {
        let student = students[Math.floor(Math.random() * students.length)];

        let courseIndex = Math.floor(Math.random() * courses.length);
        let standing = new AdvancedStandings(
            {
                course: courses[courseIndex].course,
                description: courses[courseIndex].description,
                units: Math.floor(Math.random() * 4) / 2 + 0.5, // Either 0, 0.5, 1, 1.5, or 2
                grade: Math.floor(Math.random() * 101), // From 0-100
                from: fromData[Math.floor(Math.random() * fromData.length)],
                recipient: student
            });
        standing.save((err) => {
            if (err) throw err;

            console.log("standing: " + doneCounter);
            if (++doneCounter >= 200) process.exit(0);
        });
    }
});
