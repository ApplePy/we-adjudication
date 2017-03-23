# WE Adjudication Back End Testing

This is the testing suite for the WE Adjudication system
by the Digital Panda team.

## Format
* File names should end with `-test.js` to be picked up by `npm test`.
* `genericTestFramework-helper.js` exports a lot of generic pre-written
tests that can be used to test basic behaviour.
    * By default, it configures Mocha and Chai for testing the server
    * It exports `regenAllData` to generate random data for testing
    * It exports `chai`, `expect` and `host` for some custom setup
    * The export `DBElements` contains keys that contain arrays to access
     the data that `regenAllData` produced
    * The export `Tests` contains `GetTests` among other categories of tests
     that can be used with customization options.
     
## Extending Framework
To extend the testing framework to cover more classes:
* `regenAllData` must be extended to wipe the new class model
* A new generator must be supplied to generate new objects of the new class,
 along with a call in `regenAllData` to add it to the generation
    * Remember to export the associated new content function!
    * If wrapping the new content function, do **not** use ES6 arrow functions.
* Another array must be created to store the generated class objects for
test access
    * This new list must be created under `Lists` to access it in tests
    under `DBElements`.
    
## Tips
Current tests in this folder use a _"copypasta"_ format which dynamically
generates many useful tests at runtime. To use, copy the contents
of an existing test into your new test file, and change the contents of the
`///// THINGS TO CHANGE ON COPYPASTA /////` block to fit your file.

Items to change:

| Variable Name         | Description                                                                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| emberName             | A string representing the name to be expected as the content-containing key in the API call route response                                    |
| emberNamePluralized   | A string representing the name to be used in the API call route                                                                               |
| itemList              | A list from DBElements that contains all the values of this model type that exist in the database                                             |
| EmberModel            | A Mongoose model object that this test file tests                                                                                             | 
| newModel              | A function that returns an object containing the properties required to make a new object of this model type                                  |
| filterValueSearches   | A list of strings that contain the model properties that can be searched for **(does not support partial-text or subset array search)**       |
| requiredValues        | A list of strings that contain the model properties that must be present in a update/creation of an object                                    |
| uniqueValues          | A list of strings that contain model properties that must be unique amongst all the objects **(does not support unique compound properties)** |
| testName              | The name used to identify the test. Normally is a readable version of emberName.                                                              |

#### Notes
* Remember to import all the models you need, and change the
 postPut/postPost/postDelete hooks to check for proper model
 disassociation, etc.
* Remember to change the queryOperand function if your model does/doesn't
 use pagination
