Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // code only runs on client

// template w/ helper
  Template.body.helpers({
  	tasks: function () {
  		// sort by most recent at top
  		return Tasks.find({}, {sort: {createdAt: -1}});
  	}
  });

  // template w/ event listener
  Template.body.events({
  	// listen for 'submit' event on any element that matches .new-task
  	"submit .new-task": function (event) {
  		var text = event.target.text.value;
  		// event.target = form element; .text.value = input val
  		Tasks.insert({
  			text: text,
  			createdAt: new Date() // current time
  		});

  		// Clear form -- make input blank after task inserted into Tasks collection
  		event.target.text.value = "";

  		// Prevent default form submission
  		return false;
  	}
  })
}
