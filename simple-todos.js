Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // code only runs on client
  Template.body.helpers({
  	tasks: function () {
  		return Tasks.find({});
  	}
  });
}
