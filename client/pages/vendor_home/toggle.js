$(document).ready(function(){
	

    $("#link1").click(function(){
    
        animateDiv("right_div .container");
        var content = "<p>You have Click on line1</p>"
		$("#right_div .container").html(content);
		buttonDisplay(content);
    	return false;
    });
    $("#link2").click(function(){
    animateDiv("right_div .container");
       var content;
	   $("#right_div .container").html(content);
		buttonDisplay(content);
    	return false;
    });
    $("#link3").click(function(){
    animateDiv("right_div .container");
       var content =  "<p>You have Click on line3</p>";
	   $("#right_div .container").html(content);
		buttonDisplay(content);
    	return false;
    });
    $("#link4").click(function(){
    animateDiv("right_div .container");
      var content =   "<p>You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4You have Click on line4</p>";
	  $("#right_div .container").html(content);
    	buttonDisplay(content);
		return false;
    });
    
    function animateDiv(id){
         //perform your animation here
    }
	
	
   
});

function buttonDisplay(content){
	 
	 //alert('inside div');

        var empty = false;
    //    var content = document.getElementById("right_div.container").innerHTML;
	//	alert('hiiii');
	//	alert('content is '+content);
          if(content === undefined || content === null) { 
                empty = true;
			//	alert('empty');
            }
       
        if (empty) {
			$("#right_div .container").html("");
            $("#reply").hide();
        } else {
           $("#reply").show();
		}
		
	}