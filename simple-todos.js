Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
	Meteor.subscribe("tasks");

	Template.body.helpers({
		tasks: function() {
			if (Session.get("hideCompleted")) {
				return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			} else {
				return Tasks.find({}, {sort: {createdat: -1}});
			}
		},
		hideCompleted: function () {
			return Session.get("hideCompleted");
		},
		incompleteCount: function () {
			return Tasks.find({checked: {$ne: true}}).count();
		}
	});

  	// template w/ event listener
  	Template.body.events({
  	// listen for 'submit' event on any element that matches .new-task
	  	"submit .new-task": function (event) {
	  		var text = event.target.text.value;
	  		// event.target = form element; .text.value = input val
	  		console.log(text);
	  		Meteor.call("addTask", text);

	  		// Clear form -- make input blank after task inserted into Tasks collection
	  		event.target.text.value = "";

	  		// Prevent default form submission
	  		return false;
	  	},
	  	"change .hide-completed input": function ( event ){
	  		Session.set("hideCompleted", event.target.checked);
	  	}
  	})

  	Template.task.events({
	  	// 'this' refers to individual task object
	  	// in a collection, each inserted doc has a unique _id field
	  	// get _id of current task with this._id
	  	// once have id, can use to update / remove it
	  	"click .toggle-checked": function() {
	  		Meteor.call("setChecked", this._id, ! this.checked);
	  	},
	  	"click .delete": function () {
	  		Meteor.call("deleteTask", this._id);
	  	},
	  	"click .toggle-private": function () {
	  		Meteor.call("setPrivate", this._id, ! this.private);
	  	}
  	});

  	Template.task.helpers({
  		isOwner: function () {
  			return this.owner === Meteor.userId();
  		}
  	});

  	Accounts.ui.config({
  		passwordSignupFields: "USERNAME_ONLY"
  	});
}

Meteor.methods({
	addTask: function (text){

		if ( ! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	deleteTask: function (taskId) {
		var task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Tasks.remove(taskId);
	},
	setChecked: function (taskId, setChecked) {
		var task = Tasks.findOne(taskId)
		if (task.private && task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Tasks.update(taskId, { $set: { checked: setChecked} });
	},
	setPrivate: function (taskId, setToPrivate){
		var task = Tasks.findOne(taskId);
		if (task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Tasks.update(taskId, { $set: {private: setToPrivate } });
	}
});

if (Meteor.isServer) {
	Meteor.publish("tasks", function () {
		return Tasks.find({
			$or: [
				{ private: {$ne: true } },
				{ owner: this.userId }
			]
		})
	});
}