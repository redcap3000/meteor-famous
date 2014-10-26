
/*
Ronaldo Barbachano
Oct. 2014

Example of how to setup a grid structure inside of a page
view layout within Meteor.js.

Supports removing/adding reactively!

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
	HeaderFooterLayout = famous.views.HeaderFooterLayout;
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
	layout = new HeaderFooterLayout({
			headerSize:100,
			footerSize: 50
		});

	layout.header.add(new Surface({
			content: "Header",
			properties:{
				backgroundColor: 'gray',
				lineHeight: "100px",
				textAlign: "center"
			}
		}));
	layout.content.add(new Surface({
		content : "Content",
		properties :{
			backgroundColor :'#fa5c4f',
			lineHeight: '400px',
			textAlign: 'center'
		}
	}));
	// get inner html from onscreen??
	if(typeof layout.footer.content == "undefined" || layout.footer.content == ''){
		layout.footer.add(new Surface({
		    content: $("#addRecord").html(),
		    properties: {
		        backgroundColor: 'gray',
		        lineHeight: "50px",
		        textAlign: "center"
		    }
		}));
	}
	if( typeof context != "undefined" && typeof theSurfaces != "undefined"){
		// code from code academy... sort of works but not too excited about it..
		// need to do some on window change reloading...
			var grid = new GridLayout({
			    dimensions: [2, 8]
			});
			theSurfaces = [];
			grid.sequenceFrom(theSurfaces);
			// it doesnt want to do this here??
			sampleSet.find().map(function(o){
				var s = new Surface({
					size : [undefined,undefined],
					properties : {color:"red",backgroundColor:"black"},
					content : o.name
				}
				);
				if(s){
					// storing these here because they lose scope in the on function
					var theContent = o.content, theName = o.name, theId = o._id;
					// need this as global... this is sort of a 'band aid'
					// may need to make one for id
					s.on('click', function() {
						// check for id.. force it to be a string just in case.. 
						// most session vars are strings
						if(!Session.equals("gridSelect",theId)){
							Session.set("gridSelect",theId);
							this.setContent(theContent + '<button onClick="sampleSet.remove({_id :\''+ theId +'\'});">Remove</button>');
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
					s._id = o._id;
					theSurfaces.push(s);
				}else{
					console.log('could not create surface');
				}
			});
		layout.content.add(grid);
		context.add(layout);
	}else{
		context.add(layout);
	}
	// check if any containers exist?
	var fCon = $(".famous-container");
	if(fCon.length > 1){
		//console.log(fCon.length);
		for (var i = 0; i <= fCon.length-2; i++) {
			fCon[i].remove();

		}
	}

};

Template.multiSurface.helpers({
	sampleSet: function () {
		return sampleSet.find();
	}
});
Template.addRecord.rendered = function () {
	// setup global functions for adding records directly
	// from famous dom
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
					//console.log(c.value);
					if(c.value != "undefined"){
						r.content = c.value;
					}
				}
				sampleSet.insert(r);
			}else{
				alert("Must at least have a name");
			}
		}else{
			console.log('add record error');
		}
	};
};
Template.innerSurface.destroyed = function(){
	// step one figure out surface..
	var check =  _.findWhere(theSurfaces,{ _id : this.data._id });
	if(check){
		check.setContent('');
		check.setProperties({display:"none"});
		check._invisible = true;
		check.visible = false;
		// to make sure it is no longer clickable
		check.on('click',function(){return null;});
		check = null;
		Template.multiSurface.rendered();
		// word on the street you only hide disabled surfaces :/
	}
};
Template.innerSurface.created = function(){
	//console.log(this);
	if(typeof theSurfaces != "undefined")
		var check =  _.findWhere(theSurfaces,{ _id : this.data._id });
	else
		var check = false;
	// attempt to clear out grid?
	if(!check){
		var s = new Surface({
					size : [undefined,undefined],
					properties : {color:"red",backgroundColor:"black"},
					content : this.data.name
				}
				);
		if(s){
			// storing these here because they lose scope in the on function
			var theContent = this.data.content, theName = this.data.name, theId = this.data._id;
			// may need to make one for id
			s.on('click', function() {
				// check for id.. force it to be a string just in case.. 
				// most session vars are strings
				if(!Session.equals("gridSelect",theId)){
					Session.set("gridSelect",theId);
					// add a link to allow for item deletion?
					this.setContent(theContent + '<button onClick="sampleSet.remove({_id :\''+ theId +'\'});">Remove</button>');
					
					// background color check ...
					if(this.properties.backgroundColor != "orange")
						this.setProperties({backgroundColor:"orange",color:"white"});
					else{
						this.setContent(theName);
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