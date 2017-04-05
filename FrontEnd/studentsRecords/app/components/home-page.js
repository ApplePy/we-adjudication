import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
//    Ember.$('.tabular.menu .item').tab();
    Ember.$(document).ready(function(){
      Ember.$('.ui .item').on('click', function() {
        Ember.$('.ui .item').removeClass('active');
        Ember.$(this).addClass('active');
      });
    });
  },

  pages: [
    {route: "home", icon: "large home icon", text: "Home"},
    {route: "home.students", icon: "large leanpub icon", text: "Students Records"},
    {route: "home.add-student", icon: "large add user icon", text: "Add Student"},
    {route: "home.manage-high-school", icon: "large address book icon", text: "Manage High School Data"},
    {route: "home.manage-system", icon: "large code icon", text: "Manage System"},
    {route: "home.import", icon: "large download icon", text: "Import Student Records"},
    {route: "home.manage-adjudication-codes", icon: "large code icon", text: "Manage Adjudication Codes"},
    {route: "home.manage-adjudication-rules", icon: "large write icon", text: "Manage Adjudication Rules"},
    {route: "home.adjudication", icon: "large write icon", text: "Adjudicate Students"},
    {route: "home.export", icon: "large upload icon", text: "Export Adjudication Results"}
  ]
});
