import Ember from 'ember';

export default Ember.Component.extend({
  syscodes: [
    {
      name: "Genders",
      placeholder: ["Add gender..."],
      emberName: 'gender',
      inputModelProp: [
        { name: 'name', type: "string" }
      ]
    },
    {
      name: "Residencies",
      placeholder: ["Add residency..."],
      emberName: 'residency',
      inputModelProp: [
        { name: 'name', type: "string" }
      ]
    },
    {
      name: "UWO Course Loads",
      placeholder: ["Add course load..."],
      emberName: 'course-load',
      inputModelProp: [
        { name: 'load', type: "string" }
      ]
    },
    {
      name: "UWO Program Statuses",
      placeholder: ["Add program status..."],
      emberName: 'program-status',
      inputModelProp: [
        { name: 'status', type: "string" }
      ]
    },
    {
      name: "UWO Plan Codes",
      placeholder: ["Add plan code..."],
      emberName: 'plan-code',
      inputModelProp: [
        { name: 'name', type: "string" }
      ]
    },
    {
      name: "UWO Term Codes",
      placeholder: ["Add term code..."],
      emberName: 'term-code',
      inputModelProp: [
        {name: 'name', type: "string"}
      ]
    }
  ]
});
