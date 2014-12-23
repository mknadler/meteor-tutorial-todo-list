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

  	Template.task.events({
	  	// 'this' refers to individual task object
	  	// in a collection, each inserted doc has a unique _id field
	  	// get _id of current task with this._id
	  	// once have id, can use to update / remove it
	  	"click .toggle-checked": function() {
	  		// Set checked property to opposite of current val
	  		Tasks.update(this._id, {$set: {checked: ! this.checked}});
	  		// update takes 2 args: 1st = selector that identifies a subset of collection
	  		// 2nd = update parameter that specifies what should be done
	  	},
	  	"click .delete": function () {
	  		Tasks.remove(this._id);
	  		// remove takes 1 arg: selector to determine which item to remove from collection
	  	}
  	});

}
