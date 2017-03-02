import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  syscodes: [
    {
      name: "High Schools",                 // The name to display
      placeholder: ["Add high school..."],  // The placeholder to use if a property to be filled out is a textbox. NOTE: length must match inputModelProp length!
      emberName: 'secondary-school',        // The ember model name that's being represented
      inputModelProp: [                     // The model properties that need to be filled out, and their types (or their ember name if will be a dropdown)
        { name: 'name', type: "string" }
      ]
    },
    {
      name: "High School Subjects",
      placeholder: ["Add subject...", "Description"],
      emberName: 'hs-subject',
      inputModelProp: [
        { name: 'name', type: "string" },
        { name: 'description', type: "string" }
      ]
    },
    {
      name: "High School Course Sources",
      placeholder: ["Add high school course source..."],
      emberName: 'hs-course-source',
      inputModelProp: [
        { name: 'code', type: "string" }
      ]
    },
    {
      name: "High School Courses",
      placeholder: ["Add high school course...", "Unit", "Source", "Secondary School", "Subject"],
      emberName: 'hs-course',
      inputModelProp: [
        {
          name: 'level',      // Name of the property to be filled in
          type: "number"      // The type of the property (eg string, number, etc.), or "model" to specify an enum
        },
        { name: 'unit', type: "number" },
        {
          name: 'source', type: "model", modelName: "hs-course-source", modelLabel: "code"    // The property of the model to display as the dropdown text
        },
        { name: 'school', type: "model", modelName: "secondary-school", modelLabel: "name" },
        { name: 'subject', type: "model", modelName: "hs-subject", modelLabel: "name" },
      ]
    },
  ],
});
