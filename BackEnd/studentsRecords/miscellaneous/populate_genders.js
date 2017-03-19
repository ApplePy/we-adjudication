let Genders = require('../models/schemas/studentinfo/genderSchema');
let Students = require('../models/schemas/studentinfo/studentSchema');


// Create default genders
let male = Genders({name: 'Male'});
male.save((err) => {
    if (err) throw err;

    let female = Genders({name: 'Female'});
    female.save((err) => {
        if (err) throw err;

        // Fix male students
        Students.update({gender: 1}, {$set: {'genderInfo': male._id}}, {multi: true}, function (err, updated1) {
            if (err) throw err;

            // Fix female students
            Students.update({gender: 2}, {$set: {'genderInfo': female._id}}, {multi: true}, function (err, updated2) {
                if (err) throw err;

                process.exit(0);
            });
        });
    });
});

// NOTE: 'gender' field has to be manually unset in mongo
