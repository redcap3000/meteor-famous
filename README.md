#meteor-famous


Ronaldo Barbachano
Oct. 2014

**Example of how to setup a reactive grid structure within a famous layout using Meteor.js**

Also helpful if you're using the university examples and
are really confused as to where to put various code to achieve desired results within the Meteor context.

Using mjn:famous 0.3.0_5


###How this works

1. We retreve data from a dummy template dataset function (sampleSet)
2. String that inside of template multiSurface {{#each sampleSet}} 
3. {{#each}} renders data with template {{>innerSurface}}

####Sessions

• Keeps track of a single value **(Session.get("gridSelect"))** that stores the id of the last clicked innerSurface

• Check for this value, and also the background color of the innerSurface to determine
  its selected state - Inside a **on.("click")** for a newly created surface inside innerSurface.rendered()

####Subscriptions

• For simplicity; all famous elements are removed and objects re-created; handled via Template.rendered(), created(), and destroyed().

• Template.multiSurface.rendered() is called throughout to initiate famous object recreation when data changes.


####Forms and Events
• Meteor doesn't seem to recognize events traditionally so I made global functions or javascript to call via html onClick. 
