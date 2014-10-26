// boilerplate to setup dummy records...
Meteor.startup(function(){
if( sampleSet.find().fetch().length === 0){

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
	}else{
		console.log("could not find mongo collection");
	}
});

Meteor.publish("gridExample",function(){
	return sampleSet.find({});
});
