/*
 *	Ronaldo Barbachano
 *	Oct. 2014
 *	Example of how to setup a grid structure within Meteor.js

 *	Also helpful if you're using the university examples and
 *	are really confused as to what corresponds to what. 
 *
 *	Using mjn:famous 0.3.0_5
 */

sampleSet = new Meteor.Collection("sampleSet");
// boilerplate to setup dummy records...
if (Meteor.isServer) {
	if(sampleSet.find().fetch().length == 0){
		[
			{ name:"First value", content :"<p>a first Paragraph</p>"},
			{ name:"Second value", content :"<p>a second Paragraph</p>"},
			{ name:"Third value", content :"<p>a third Paragraph</p>"},
			{ name:"Fourth value", content :"<p>a fourth Paragraph</p>"},
			{ name:"Fifth value", content :"<p>a fifth Paragraph</p>"},
			{ name:"Sixth value", content :"<p>a sixth Paragraph</p>"},
			{ name:"Seventh value", content :"<p>a seventh Paragraph</p>"},
			{ name:"Eight value", content :"<p>a eight Paragraph</p>"},
			{ name:"Ninth value", content :"<p>a ninth Paragraph</p>"},
			{ name:"Tenth value", content :"<p>a tenth Paragraph</p>"},
			{ name:"Eleventh value", content :"<p>a eleventh Paragraph</p>"},
			{ name:"Twelve value", content :"<p>a twelevth Paragraph</p>"}
		].filter( function (obj){
			sampleSet.insert(obj);
		});
	}
	Meteor.publish("gridExample",function(limit,name){
		var projections = {};
		var query = {};
		if(typeof limit == "undefined" || !limit){
			projections.limit = 3;
		}
		if(typeof name != "undefined" && typeof name == "string"){
			query.name = "string";
		}
		return sampleSet.find(query,projections);
	});
}
if (Meteor.isClient) {

Meteor.startup(function(){
	// for working with the university examples...
	// every famous page needs one of these I believe 
	context = famous.core.Engine.createContext(),
	Surface = famous.core.Surface,
	StateModifier = famous.modifiers.StateModifier,
	GridLayout = famous.views.GridLayout;
	// this is used to push values from innerSurface to be
	// passed to .sequenceFrom for the grid
	theSurfaces = [];
	// make reactive...
	// why is it not reactive... not sure...
	Meteor.subscribe("gridExample");
});
/*
 *	 Dummy data.. replace with a mongo query or mapping of your choice!
 */
Template.gridExample.helpers({
	sampleSet: function () {
		return sampleSet.find();

	}
});
// this is highly discouraged ... 
Template.innerSurface.destroyed = function(){
	// step one figure out surface..
	var check =  _.findWhere(theSurfaces,{_id : this.data._id});
	if(check){
		check.setContent('');
		check.setProperties({display:"none"});
		check._invisible = true;
		// to make sure it is no longer clickable
		s.on('click',function(){return null;});
		// word on the street you only hide disabled surfaces :/
	}
};
Template.innerSurface.rendered = function(){
	var contextSize = context.getSize()
	var s = new Surface({
		size : [undefined,contextSize[1] / 2.0],
		properties : {color:"red",backgroundColor:"black"},
		content : this.data.name
	}
	);
	if(s){
		// storing these here because they lose scope in the on function
		var theContent = this.data.content, theName = this.data.name;
		s.on('click', function() {
			// check for id.. force it to be a string just in case.. 
			// most session vars are strings
			if(!Session.equals("gridSelect",this.id+ '')){
				Session.set("gridSelect",this.id + '');
				this.setContent(theContent);
				// background color check ...
				if(this.properties.backgroundColor != "orange")
					this.setProperties({backgroundColor:"orange",color:"white"});
				else{
					this.setProperties({backgroundColor:"black",color:"red"});
				}
			}else{
				// restore 'defaults somehow...'
				this.setContent(theName);
				this.setProperties({backgroundColor:"black",color:"red"});
				// clear the currently selected grid
				Session.set("gridSelect",undefined);
			}
		});
		// push surface for multiSurface.rendered
		s._id = this.data._id;
		theSurfaces.push(s);
	}else{
		console.log('could not create surface');
	}
};

Template.gridExample.rendered = function(){
	if( typeof context != "undefined"){
		// code from code academy... sort of works but not too excited about it..
		// need to do some on window change reloading...
		var contextSize = context.getSize(),
		dimensions;
		if (contextSize[0] < 480 || contextSize[1] < 480) {
		    dimensions = [2,8];
		} else {
		    dimensions = [8,2];
		};
		grid = new GridLayout({
		    dimensions: dimensions
		});
		grid.sequenceFrom(theSurfaces);
		context.add(grid);
	}else{
		console.log('no context; is the module loaded?');
	}
}
};