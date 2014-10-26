Ronaldo Barbachano
Oct. 2014

Example of how to setup a grid structure within Meteor.js

Also helpful if you're using the university examples and
are really confused as to what corresponds to what. 

Using mjn:famous 0.3.0_5


How this works!

1 ) We retreve data from a dummy template dataset function (sampleSet)
2 ) String that inside of template multiSurface {{#each sampleSet}} 
3 ) {{#each}} renders data with template {{>innerSurface}}

Sessions

• Keeps track of a single value (Session.get("gridSelect")) that stores the id of the last clicked innerSurface
• We check for this value, and also the background color of the innerSurface to determine
  its selected state. Inside a on.("click") for a newly created surface inside innerSurface.rendered()

Subscriptions

• This needs some work, but the destroy function sort of works around a known issue. But it is reactive!

