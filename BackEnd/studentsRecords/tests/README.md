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
* Another array must be created to store the generated class objects for
test access
    * This new list must be exported under `DBElements` to access it in tests.