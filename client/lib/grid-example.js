
/*
Ronaldo Barbachano
Oct. 25 2014

Example of how to setup a grid structure inside of a page
view layout within Meteor.js. Combines concepts several of the online lessons to
function in a reactive meteor enviornment. Learn with me!

Supports removing/adding reactively!

Also helpful if you're using the university examples and
are really confused as to what corresponds to what. 

Using mjn:famous 0.3.0_5


How this works!

1 ) Retreve data from a dummy template dataset function (sampleSet)
2 ) String that inside of template multiSurface {{#each sampleSet}} 
3 ) {{#each}} renders data with template {{>innerSurface}}
4 ) Use created/rendered/destroyed functions to control when things get added to the context

Forms

Meteor's templates are tricky (even possible?) to map to famous so I've resorted to using
onClick parameters in the html and a global function (and jquery to get the web page data.)
Its a step backwards but it works! Also included is a way to inject a form's HTML into a surface using
$('#div').html.

Sessions

• Keeps track of a single value (Session.get("gridSelect")) that stores the id of the last clicked innerSurface
• We check for this value, and also the background color of the innerSurface to determine
  its selected state. Inside a on.("click") for a newly created surface inside innerSurface.rendered()

Subscriptions

• Continually re-create the grid each time something changes; and use jquery to remove any dom elements
  that may remain from past sets.

*/
Meteor.startup(function(){
	// I set these up to keep them as global.. a lot of this stuff is to
	// simplify syntax as per mjn:famous package setup and 
	// for working with the university examples...
	// every famous page needs one of these I believe 
	//context = famous.core.Engine.createContext(),
	Surface = famous.core.Surface,
	StateModifier = famous.modifiers.StateModifier,
	GridLayout = famous.views.GridLayout;
	HeaderFooterLayout = famous.views.HeaderFooterLayout,
	Modifier = famous.core.Modifier,
	Transform = famous.core.Transform,
	Transitionable = famous.transitions.Transitionable,

	Easing = famous.transitions.Easing;
	// for the selectable items.. sets selected/unselected states - tracks it too
	// via gridSelect Session key
	makeInnerSurface = function(_id,name,content){
		var defaultSelectedProp = {backgroundColor:"orange",color:"white",textAlign:"center"},
			defaultProp = {backgroundColor:"black",color:"red",textAlign:"center"};
		var s = new Surface({
					size : [undefined,undefined],
					properties : defaultProp,
					content : '<h2>'+name+'</h2>'
				}
				);
		if(s){
			// storing these here because they lose scope in the on function
			// may need to make one for id
			s.on('click', function() {
				console.log(_id);
				// check for id.. force it to be a string just in case.. 
				// most session vars are strings
				if(!Session.equals("gridSelect",_id)){
					// add a link to allow for item deletion?
					this.setContent('<h2>'+name+'</h2>' + content + '<button onClick="sampleSet.remove({_id :\''+ _id +'\'});">Remove</button>');
					// background color check ...
					if(this.properties.backgroundColor != "orange"){
						Session.set("gridSelect",_id);
						this.setProperties(defaultSelectedProp);
					}
					else{
						this.setContent('<h2>'+name+'</h2>');
						this.setProperties(defaultProp);
						Session.set("gridSelect",undefined);
					}
				}else{
					// restore 'defaults somehow...'
					this.setContent('<h2>'+name+'</h2>');
					this.setProperties(defaultProp);
					// clear the currently selected grid
					Session.set("gridSelect",undefined);
				}
			});
			return s;
		}
		return false;
	};
	addRecord = function(){
		// weird thing... bug workaround with getting the right input
		var v = $(".rName");
		var c = $(".rContent");
		var r = {};
		if(v && v.length > 0){
			// get last element
			var v = v[v.length-1];
			if(v && typeof v.value != "undefined" && v.value != ''){
				r.name = v.value
				if(c && c.length > 0){
					var c = c[c.length-1];
					if(c.value != "undefined"){
						r.content = c.value;
					}
				}
				sampleSet.insert(r,function(err,result){
					if(typeof err == "undefined"){
						Template.multiSurface.rendered();
					}
				});
			}else{
				alert("Must at least have a name");
			}
		}else{
			console.log('add record error');
		}
	};
	// this is used to push values from innerSurface to be
	// passed to .sequenceFrom for the grid
	Meteor.subscribe("gridExample",function(err,result){
		if(typeof err == "undefined"){
			console.log('subbed');
			Template.multiSurface.rendered();
			//next add surfaces based on subscription data???
		}else{
			console.log('sub error');
		}
	});
});

Template.multiSurface.rendered = function(){
	context = famous.core.Engine.createContext();

	// make header footer layout structures
	layout = new HeaderFooterLayout({
			headerSize:100,
			footerSize: 50
		});

		var modifier = new Modifier();
	var opacityState = new Transitionable(0);

	layout.header.add(modifier).add(new Surface({
		content: $("#header").html(),
		properties:{
			backgroundColor: 'gray',
			lineHeight: "100px",
			textAlign: "center"
		}
		}));
	modifier.opacityFrom(opacityState);
	opacityState.set(
	    1,
	    {curve : 'linear', duration : 500},
	    function(){ console.log('header animation finished!'); }
	);
	layout.content.add(new Surface({
		properties :{
			backgroundColor :'white',
			lineHeight: '400px',
			textAlign: 'center'
		}
	}));
	// get inner html from onscreen??
	var modifierF = new Modifier();
	var opacityStateF = new Transitionable(0);
	if(typeof layout.footer.content == "undefined" || layout.footer.content == ''){
		layout.footer.add(modifierF).add(new Surface({
		    content: $("#addRecord").html(),
		    properties: {
		        backgroundColor: 'gray',
		        lineHeight: "50px",
		        textAlign: "center"
		    }
		}));
	}
	modifierF.opacityFrom(opacityStateF);
	opacityStateF.set(
	    1,
	    {curve : 'linear', duration : 600},
	    function(){ console.log('footer animation finished!'); }
	);

	var fCon = $(".famous-container");
	if(fCon.length > 1){
		for (var i = 0; i <= fCon.length-2; i++) {
			fCon[i].remove();

		}
	}
	// cant use the same modifier? hmmm be careful here...
	var modifier = new Modifier();
	var opacityState = new Transitionable(0);
	if( typeof context != "undefined" && typeof theSurfaces != "undefined"){
		// code from code academy... sort of works but not too excited about it..
		// need to do some on window change reloading...
		var grid = new GridLayout({
		    dimensions: [2, 4]
		});
		theSurfaces = [];
		grid.sequenceFrom(theSurfaces);
		sampleSet.find().map(function(o){
			var s = makeInnerSurface(o._id,o.name,o.content);
				// push surface for multiSurface.rendered
				if(s){
					s._id = o._id;
					theSurfaces.push(s);
				}else{
					console.log("could not make surface");
				}
		});
		// modifier with transitonable	
		layout.content.add(modifier).add(grid);
		context.add(modifier).add(layout).add(modifier);
		modifier.opacityFrom(opacityState);
		opacityState.set(
		    1,
		    {curve : 'linear', duration : 400},
		    function(){ console.log('animation finished!'); }
		);
	}else{
		context.add(modifier).add(layout);
	}
};

Template.multiSurface.helpers({
	sampleSet: function () {
		return sampleSet.find();
	}
});

Template.innerSurface.destroyed = function(){
	// step one figure out surface..
	var check =  _.findWhere(theSurfaces,{ _id : this.data._id });
	if(check){
		Template.multiSurface.rendered();
		// word on the street you only hide disabled surfaces :/
	}
};
Template.innerSurface.created = function(){
	if(typeof theSurfaces != "undefined")
		var check =  _.findWhere(theSurfaces,{ _id : this.data._id });
	else
		var check = false;
	// attempt to clear out grid?
	if(!check){
		var s = makeInnerSurface(this.data._id,this.data.name,this.data.content);
		if(s){
			s._id = this.data._id;
			if(typeof theSurfaces == "undefined"){
				theSurfaces = [];
			}
			theSurfaces.push(s);
		}else{
			console.log('could not create surface');
		}
		console.log('\n\tshould attempt to create this object');
	}
};