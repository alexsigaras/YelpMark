// This is the Yelp Search Javascript that returns results from Yelp.

// Authentication Methods.

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Alex

var auth1 = { 
  consumerKey: "BeAYtgfFQGaR8ZS32wrskQ", 
  consumerSecret: "fzQMiwgbasP0cYnAgKA1Sxd0JFU",
  accessToken: "L5qYY71AlaLFvOV9yo4d7XPhUI7RyiDz",
  accessTokenSecret: "uoDm4tPYFGOp_fWsgMkYxqtZgA8",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

var auth5 = { 
  consumerKey: "3kvAWuDWmEDbO2XXoDs9lw", 
  consumerSecret: "0Cz3Qh-_013bC1bzMEFOoRnBNs0",
  accessToken: "l2L7AKmLGPzr-GVwgNo2nNPijRxpv9jx",
  accessTokenSecret: "fItZvb98fgcc7wjkL-rO1tO-LuI",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

var auth6 = { 
  consumerKey: "9yRKsTpxegI5O2CMQSaxPw", 
  consumerSecret: "KrSdHtKimYfysFW4RRdml19UMmM",
  accessToken: "5FJ5spnFUo14HhfM1y1AqATf-lOfI7HX",
  accessTokenSecret: "pOI_E5x1eTy1wI6YcizzulGzYvQ",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

// Morris

var auth2 = { 
  consumerKey: "uAo­UtFYL11MzXdLMe565A", 
  consumerSecret: "1qKxt5FZFt4udBXQFE9u_jHO8z8",
  accessToken: "qDvg5Dzem9GLTJCGnWGFOG5gryW0LfwQ",
  accessTokenSecret: "V2HsM3q0l04fSGIX019hwgBGvl8",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

// Michael

var auth3 = { 
  consumerKey: "8NNZ5ajEDKLj_Zs7p7Uj_Q", 
  consumerSecret: "4EvxOA4imilRM2-aiPwoy4qdYmU",
  accessToken: "Zx75ALaTDWfRChazVBf1-0CV09XjsgnL",
  accessTokenSecret: "nCvjSZwUuCSCqh2_SNU6WzZK9tQ",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

// Seung Woo

var auth4 = { 
  consumerKey: "nuceAW1zjGXNkQp4sjK", 
  consumerSecret: "qWYAoriy3fufjX9J9jYkmYeH0pI",
  accessToken: "Q0n1pPIY8fJ_sYeous3JF3Hh250ZvgDM",
  accessTokenSecret: "3OSJp_QEOPgrpIkEI4lz0qxDp_U",
  serviceProvider: { 
    signatureMethod: "HMAC-SHA1"
  }
};

// Authentication Credentials to use.
var auth = auth1;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var currentSearchOffset = 0;

var maxOffset = 0;

  // bookmark.getItem[0].tags
  // bookmark.getItem[0].obj
  // JSON.parse(bookmark.getItem[0].obj)
  


   // #     #                                      ######                                                          
   // #     # #####  #####    ##   ##### ######    #     #  ####   ####  #    # #    #   ##   #####  #    #  ####  
   // #     # #    # #    #  #  #    #   #         #     # #    # #    # #   #  ##  ##  #  #  #    # #   #  #      
   // #     # #    # #    # #    #   #   #####     ######  #    # #    # ####   # ## # #    # #    # ####    ####  
   // #     # #####  #    # ######   #   #         #     # #    # #    # #  #   #    # ###### #####  #  #        # 
   // #     # #      #    # #    #   #   #         #     # #    # #    # #   #  #    # #    # #   #  #   #  #    # 
   //  #####  #      #####  #    #   #   ######    ######   ####   ####  #    # #    # #    # #    # #    #  ####  

   function updateBookmarks()
   {

    var bookmarks = bookmark.getItem("bookmarks", "object");

    
    var dist_categories = getBookmarkDistinctCategories(bookmarks);
    if(dist_categories.length > 0){
      $("#bookmarkCategorySelect").empty();
      $("#bookmarkCategorySelect").append('<br /><select id="bmstars"><option value="all">All</option><option value="above2Stars">more than 2 stars</option><option value="above3Stars">more than 3 stars</option><option value="above4Stars">more than 4 stars</option></select><br />');
      $("#bookmarkCategorySelect").append("<table>");
    }
    else{
      $("#bookmarkCategorySelect").empty();
      $("#bookmarkCategorySelect").append("<h2>Bookmarks<h2>");
    }



    for (var i = 0; i < dist_categories.length; i++)
    {
      $("#bookmarkCategorySelect").append('<tr><td><input class="categorySelect" type="checkbox" value="' + dist_categories[i][1] + '"></input></td><td>' + dist_categories[i][0] + '</td></tr>');
      totalCats.push(dist_categories[i][1]);
    }


    $('.categorySelect', '#bookmarkCategorySelect').each(function(){
     this.checked = true;
   });

    for (var i = 0; i < dist_categories.length; i++)
      cats.push(dist_categories[i][1]);

    $("#bookmarkCategorySelect").append("</table>");

    ///Filter by Star
    $("#bmstars").change(function() {
      redrawBookmarks();
    });

    $('.categorySelect', '#bookmarkCategorySelect').each(function(){
      $(this).click(function()
      {
       if ($(this).is(':checked'))
       {
        cats.push($(this).val());
      }
      else
      {
        cats.splice(cats.indexOf($(this).val()), 1);
      }

      redrawBookmarks();
    });
    });

    $('#BookmarkPanel').empty();
    deleteBookInfoWindows();
    deleteBookMarks();
    if(bookmarks && bookmarks.length > 0) 
    {
     var deleteAllBtn = $("<div class='deleteAllBookmarks'><button class='btn btn-small' title='Delete All Bookmarks' onclick='deleteAllBookmarks();'><i class='icon-trash'></i></button>Delete All</div>");
     deleteAllBtn.click(function(){

     })
     deleteAllBtn.appendTo($('#BookmarkPanel')); 
     for(var cnt = 0 ; cnt <bookmarks.length; cnt++)
     {  
       var element = $("<div class='eachResult'></div>");
       var text = $("<div class='resultText' style='float: right;'></div>");
       var container = $("<div style='float:left; width: 50px; padding: 5px;'></div>");
       var moreInfo = $("<button class='btn btn-small " + cnt + "' title='More Info'><i class='icon-question-sign'></i></button>");
       var location = JSON.parse(bookmarks[cnt].obj);
       var url = $("<input type='hidden' class='locationUrl' value='" + location.url + "'/>");
       var id = $("<input type='hidden' class='locationId' value='" + bookmarks[cnt].id + "'/>");
       if(pos)
        var addDirectionsButton = $('<button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Get Driving Directions" onclick="calcRoute(' + location.location.coordinate.latitude + ', ' + location.location.coordinate.longitude + ');"><i class="icon-road"></i></button>');
      
      addBookMarker(location, cnt); 

      showBookMarks();
      moreInfo.click(function() {

       var location = JSON.parse(bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].obj);
       var categories = "";
       for (var i = 0; i < location.categories.length; i++)
       {
         categories += location.categories[i][0] + ", ";
       }
       $("#venueTitle").html("<a target='_blank' href='" + location.url + "'>" + location.name + "</a><br /><span class='categories'> " + categories + "</span>");
       if(location.image_url != undefined)
       {
         $("#venueImage").html("<img src='" + location.image_url + "' />");
       }
       else
       {
        $("#venueImage").html("<img src='images/defaultBusiness.png' />");     
      }
      var address = "";
      for (var i = 0; i < location.location.display_address.length; i++){
       address += location.location.display_address[i] + "<br />";
     }
     $("#venueAddress").html("<span style='font-weight: bold'>" + location.display_phone + "</span><br />" + address);
     if(pos){
      $("#venueDirections").empty();
      $("#venueDirections").html(addDirectionsButton);
    }
    $("#venueRating").html("<img src='" + location.rating_img_url + "' /><br />" + location.rating + " / 5 from " + location.review_count + " reviews."); 

    $("#venueSnippet").html(location.snippet_text);

    if (bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].comment)
      $("#venueComment").html("Comment: " + bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].comment);
    else
      $('#venueComment').html("No comment.");

    var tags = "<span class='venueTags'>Your tags: ";

    for (var i = 0; i < (bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].tags).length; i++)
    {
      tags += bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].tags[i] + ", ";
    }

    tags += "</span>";

    $("#venueTags").html(tags);
    $("#modal").modal("show");
  });   
container.append(moreInfo).append(url).append(id).append(editBookmarkButton(bookmarks[cnt].id)).append(deleteBookmarkButton(bookmarks[cnt].id, location.url));  


if(location.image_url != undefined)
{
 element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='" + location.image_url + "' />");
}
else
{
 element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='images/defaultBusiness.png' />");
}

element.append(container);

text.append("<div style='max-width: 100px; float: right'; padding: 5px;>" + "<span style='text-align: right; float: right;'>" + location.name + "</span><br />" + "<img style='margin-top: 5px; float: right;' src='" + location.rating_img_url + "' /></div>");

element.append(text);

$('#BookmarkPanel').append(element);
}
}
  } //end of update bookmarks
  
  function containsTags (arr, arr2)
  {
   for (var i=0; i < arr.length; i++)
   {
    if (contains2(arr2, arr[i][1]))
    	return true;
  }
  return false;
}

function contains2 (a, obj) 
{
	var i = a.length;
	while (i--) {
   if (a[i] == obj) {
    return true;
  }
}

return false;
}

                                            // #####                                     
 // #####  ###### #####  #####    ##   #    # #     # ######   ##   #####   ####  #    # 
 // #    # #      #    # #    #  #  #  #    # #       #       #  #  #    # #    # #    # 
 // #    # #####  #    # #    # #    # #    #  #####  #####  #    # #    # #      ###### 
 // #####  #      #    # #####  ###### # ## #       # #      ###### #####  #      #    # 
 // #   #  #      #    # #   #  #    # ##  ## #     # #      #    # #   #  #    # #    # 
 // #    # ###### #####  #    # #    # #    #  #####  ###### #    # #    #  ####  #    # 

 function redrawSearch() {

   $('#searchResultPanel').empty();
   var index = 0;
   deleteSearchMarks();
   deleteInfoWindows();
   
   var currentResults;
   
   if ($('#searchstars').val() != "all")
    currentResults = yelpFilterResultsBy(results, $('#searchstars').val());
  else
   currentResults = results;

 $(currentResults).each(function() {
  if (containsTags(this.categories, distinctSolo)) {
    var element = $("<div class='eachResult'></div>");
    var text = $("<div class='resultText' style='float: right;'></div>");
    var container = $("<div style='float:left; width: 50px; padding: 5px;'></div>");
    var addBookmark = true;
    if(pos)
      var addDirectionsButton = $('<button id="iwBookButton" class="btn btn-small" style="" style="margin-top: 2px" title="Get Driving Directions" onclick="calcRoute(' + this.location.coordinate.latitude + ', ' + this.location.coordinate.longitude + ');"><i class="icon-road"></i></button>');
    var addBookmarkBtn = $("<button class='btn btn-small addBookmark' style=' style='margin-top: 2px' title='Add Bookmark'><i class='icon-bookmark'></i></button>");
    var inputIdHidden = $("<input type='hidden' class='locationUrl' value='" + this.url +"'/>");

    if(bookmark.alreadyBookmark(this)) addBookmarkBtn.attr({"disabled":"disabled", "title":""});
    var moreInfo = $("<button class='btn btn-small' title='More Info'><i class='icon-question-sign'></i></button>");

    var location = this;

    moreInfo.click(function() {

      var categories = "";

      for (var i = 0; i < location.categories.length; i++)
      {
        categories += location.categories[i][0] + ", ";
      }

      $("#venueTitle").html("<a target='_blank' href='" + location.url + "'>" + location.name + "</a><br /><span class='categories'> " + categories + "</span>");

      if(location.image_url != undefined)
      {
        $("#venueImage").html("<img src='" + location.image_url + "' />");
      }
      else
      {
       $("#venueImage").html("<img src='images/defaultBusiness.png' />");     
     }
     var address = "";

     for (var i = 0; i < location.location.display_address.length; i++)
      address += location.location.display_address[i] + "<br />";

    $("#venueAddress").html("<span style='font-weight: bold'>" + location.display_phone + "</span><br />" + address);
    if(pos){
      $("#venueDirections").empty(); 
      $("#venueDirections").html(addDirectionsButton);
    }
    $("#venueRating").html("<img src='" + location.rating_img_url + "' /><br />" + location.rating + " / 5 from " + location.review_count + " reviews."); 
    $("#venueSnippet").html(location.snippet_text);
    $("#venueComment").html("");
    $("#venueTags").html("");
    $("#modal").modal("show");
  });


var  imgurl;
      // Add the markers for the map
      if(location.image_url != undefined){
        imgurl=location.image_url;
      }
      else{
        imgurl="images/defaultBusiness.png";
      }

      addResultMarker(this, index);
      index=index+1;


      container.append(moreInfo).append(addBookmarkBtn).append(inputIdHidden);    

      if(this.image_url != undefined)
      {
        element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='" + this.image_url + "' />");
      }
      else
      {
        element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='images/defaultBusiness.png' />");
      }
      element.append(container);

      text.append("<div style='max-width: 100px; float: right'; padding: 5px;>" + "<span style='text-align: right; float: right;'>" + this.name + "</span><br />" + "<img style='margin-top: 5px; float: right;' src='" + this.rating_img_url + "' /></div>");

      addBookmarkBtn.click(function(){
        addBookmarkBtnClick(location, $(this)); 
      });
      element.append(text);

      $('#searchResultPanel').append(element);
    }
  });

      //Show all of the search results on the map
      showSearchMarks();
      lock = false;
    }


 //                                           ######                       #     #                             
 // #####  ###### #####  #####    ##   #    # #     #  ####   ####  #    # ##   ##   ##   #####  #    #  ####  
 // #    # #      #    # #    #  #  #  #    # #     # #    # #    # #   #  # # # #  #  #  #    # #   #  #      
 // #    # #####  #    # #    # #    # #    # ######  #    # #    # ####   #  #  # #    # #    # ####    ####  
 // #####  #      #    # #####  ###### # ## # #     # #    # #    # #  #   #     # ###### #####  #  #        # 
 // #   #  #      #    # #   #  #    # ##  ## #     # #    # #    # #   #  #     # #    # #   #  #   #  #    # 
 // #    # ###### #####  #    # #    # #    # ######   ####   ####  #    # #     # #    # #    # #    #  ####  

 function redrawBookmarks() {

    // if($('#bmstars').length == 0){
    //   $("#bookmarkCategorySelect").prepend('<br /><select id="bmstars"><option value="all">All</option><option value="above2Stars">more than 2 stars</option><option value="above3Stars">more than 3 stars</option><option value="above4Stars">more than 4 stars</option></select><br />');
    // }

   var bookmarks = bookmark.getItem("bookmarks", "object");

   if ($('#bmstars').val() != "all")
    bookmarks = yelpFilterBookmarksBy(bookmarks, $('#bmstars').val());


  $('#BookmarkPanel').empty();

  deleteBookInfoWindows();
  deleteBookMarks();
  if(bookmarks.length > 0) 
  {

   $("<div class='deleteAllBookmarks'><button class='btn btn-small' title='Delete All Bookmarks' onclick='deleteAllBookmarks();'><i class='icon-trash'></i></button></div>").appendTo($('#BookmarkPanel')); 
   for(var cnt = 0 ; cnt <bookmarks.length; cnt++)
   {
     var itemcats = JSON.parse(bookmarks[cnt].obj).categories;
     if (itemcats && containsTags(itemcats, cats))
     {	  
       var element = $("<div class='eachResult'></div>");
       var text = $("<div class='resultText' style='float: right;'></div>");
       var container = $("<div style='float:left; width: 50px; padding: 5px;'></div>");
       var moreInfo = $("<button class='btn btn-small " + cnt + "' title='More Info'><i class='icon-question-sign'></i></button>");
       var location = JSON.parse(bookmarks[cnt].obj);
       var url = $("<input type='hidden' class='locationUrl' value='" + location.url + "'/>");
       var id = $("<input type='hidden' class='locationId' value='" + bookmarks[cnt].id + "'/>");

       addBookMarker(location, cnt); 
       showBookMarks();

       moreInfo.click(function() {

         var location = JSON.parse(bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].obj);
         var categories = "";
         for (var i = 0; i < location.categories.length; i++)
         {
           categories += location.categories[i][0] + ", ";
         }
         $("#venueTitle").html("<a target='_blank' href='" + location.url + "'>" + location.name + "</a><br /><span class='categories'> " + categories + "</span>");
         if(location.image_url != undefined)
         {
           $("#venueImage").html("<img src='" + location.image_url + "' />");
         }
         else
         {
          $("#venueImage").html("<img src='images/defaultBusiness.png' />");     
        }
        var address = "";
        for (var i = 0; i < location.location.display_address.length; i++){
         address += location.location.display_address[i] + "<br />";
       }
       $("#venueAddress").html("<span style='font-weight: bold'>" + location.display_phone + "</span><br />" + address);
       $("#venueRating").html("<img src='" + location.rating_img_url + "' /><br />" + location.rating + " / 5 from " + location.review_count + " reviews."); 

       $("#venueSnippet").html(location.snippet_text);

       if (bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].comment)
        $("#venueComment").html("Comment: " + bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].comment);
      else
        $('#venueComment').html("No comment.");

      var tags = "<span class='venueTags'>Your tags: ";

      for (var i = 0; i < (bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].tags).length; i++)
      {
        tags += bookmark.getItem("bookmarks")[$(this).attr('class').split(' ')[2]].tags[i] + ", ";
      }

      tags += "</span>";

      $("#venueTags").html(tags);
      $("#modal").modal("show");
    });


container.append(moreInfo).append(url).append(id).append(editBookmarkButton(bookmarks[cnt].id)).append(deleteBookmarkButton(bookmarks[cnt].id, location.url));  

if(location.image_url != undefined)
{
 element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='" + location.image_url + "' />");
}
else
{
 element.append("<img style='width: 50px; height: auto; margin: 5px; float: left;' src='images/defaultBusiness.png' />");
}

element.append(container);

text.append("<div style='max-width: 100px; float: right'; padding: 5px;>" + "<span style='text-align: right; float: right;'>" + location.name + "</span><br />" + "<img style='margin-top: 5px; float: right;' src='" + location.rating_img_url + "' /></div>");

element.append(text);

$('#BookmarkPanel').append(element);
}
}
}
}



 //                                      #####                         
 //  ####  #    # #####  #    # # ##### #     # #      #  ####  #    # 
 // #      #    # #    # ##  ## #   #   #       #      # #    # #   #  
 //  ####  #    # #####  # ## # #   #   #       #      # #      ####   
 //      # #    # #    # #    # #   #   #       #      # #      #  #   
 // #    # #    # #    # #    # #   #   #     # #      # #    # #   #  
 //  ####   ####  #####  #    # #   #    #####  ###### #  ####  #    # 

 submit_click = function(e){
    //if a new search is performed remove all marks from the map
    deleteSearchMarks();
    deleteInfoWindows();
    $('#searchResultPanel').empty(); // Empty the searchResultPanel.
    $('#categorySelect').empty();
    distinct = new Array();
    distinctSolo = new Array();
    results = new Array();

    currentSearchOffset = 0;
    maxOffset = 0;
    if ((currentPosLat) && ($('#location').val() == "near me")) // Search Yelp with Geocoordinates.
    {

      yelpSearchCurrentLocation($('#term').val(), currentPosLat, currentPosLon, currentSearchOffset, 2, items);
    }
    else
    {
      yelpSearch($('#term').val(), $('#location').val(), currentSearchOffset, 2, items); // Search Yelp with location textbox value.
    }
  }
  
  

   //                                                  ######                      
   // #####  #####   ####   ####  ######  ####   ####  #     #   ##   #####   ##   
   // #    # #    # #    # #    # #      #      #      #     #  #  #    #    #  #  
   // #    # #    # #    # #      #####   ####   ####  #     # #    #   #   #    # 
   // #####  #####  #    # #      #           #      # #     # ######   #   ###### 
   // #      #   #  #    # #    # #      #    # #    # #     # #    #   #   #    # 
   // #      #    #  ####   ####  ######  ####   ####  ######  #    #   #   #    # 

   function processData(data)
   {

     maxOffset = data.total;

     var distinctToAdd = new Array();

     if (distinctSolo.length == distinct.length)
     {
      $("#categorySelect").empty();
      $("#categorySelect").append('<br /><select id="searchstars"><option value="all">All</option><option value="above2Stars">more than 2 stars</option><option value="above3Stars">more than 3 stars</option><option value="above4Stars">more than 4 stars</option></select><br />');

      $("#searchstars").change(function() {
        redrawSearch();
      });

      var dist_categories = getSearchResultDistinctCategories(data);

      for (var i = 0; i < dist_categories.length; i++)
      {
        if(!contains(distinct, dist_categories[i]))
        {
         distinct.push(dist_categories[i]);
         distinctSolo.push(dist_categories[i][1]);
       }
     }

     distinctToAdd = distinct;

     for (var i = 0; i < distinctToAdd.length; i++)
     {
      $("#categorySelect").append('<input class="categorySelect" type="checkbox" value="' + distinctToAdd[i][1] + '"></input>' + distinctToAdd[i][0] + '<br />');
    }

    $('.categorySelect', '#categorySelect').each(function(){
      this.checked = true;
    });

  }
  else
  {
    var dist_categories = getSearchResultDistinctCategories(data);

    for (var i = 0; i < dist_categories.length; i++)
    {
      if(!contains(distinct, dist_categories[i]))
      {
        distinct.push(dist_categories[i]);
        distinctToAdd.push(dist_categories[i]);
      }
    }

    for (var i = 0; i < distinctToAdd.length; i++)
    {
      $("#categorySelect").append('<input class="categorySelect checkMe" type="checkbox" value="' + distinctToAdd[i][1] + '"></input>' + distinctToAdd[i][0] + '<br />');
    }

    $('.checkMe', '#categorySelect').each(function(){
      this.checked = true;
    });

  }

  $('.categorySelect', '#categorySelect').each(function(){
   $(this).unbind();
   $(this).click(function()
   {
    if ($(this).is(':checked'))
    {
     distinctSolo.push($(this).val());
   }
   else
   {
     distinctSolo.splice(distinctSolo.indexOf($(this).val()), 1);
   }

   items = "";

   for (var i = 0; i < distinctSolo.length; i++)
   {
    items += distinctSolo[i];
    if (i != distinctSolo.length - 1){
     items += ",";
   }
 }
 
 //alert(items);

 redrawSearch();
});
 });


  for (var i=0; i<data.businesses.length; i++)
    results.push(data.businesses[i]);

  redrawSearch();
}

function callAddBookmark(location, tags, comment, addBtn)
{


  bookmark.add(location, tags, comment);
  if(addBtn){
    addBtn.addClass("disabled");
    addBtn.attr({'disabled':'disabled',"title":""});
  }

 //need to append list of unique categories from these locations to the checkboxes section
 //add in checked
 for (var i = 0; i < location.categories.length; i++)
 {
 	if(!contains(totalCats, location.categories[i][1]))
   {
    totalCats.push(location.categories[i][1]);
    cats.push(location.categories[i][1]);
    $("#bookmarkCategorySelect").append('<input class="categorySelect toCheck" type="checkbox" value="' + location.categories[i][1] + '"></input></td><td>' + location.categories[i][0] + '<br />');
    $('.toCheck', '#bookmarkCategorySelect').each(function(){
      this.checked = true;
      $(this).removeClass('toCheck');
    });
  }
}

redrawBookmarks();
}



 //                             #####                                     
 // #   # ###### #      #####  #     # ######   ##   #####   ####  #    # 
 //  # #  #      #      #    # #       #       #  #  #    # #    # #    # 
 //   #   #####  #      #    #  #####  #####  #    # #    # #      ###### 
 //   #   #      #      #####        # #      ###### #####  #      #    # 
 //   #   #      #      #      #     # #      #    # #   #  #    # #    # 
 //   #   ###### ###### #       #####  ###### #    # #    #  ####  #    # 

 function yelpSearch(query, location, currentSearchOffset, sort, category_filter) {

  var terms = query;
  var near = location;

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['offset', currentSearchOffset]);
  parameters.push(['sort', sort]);
  if (category_filter!="")
  {
    parameters.push(['category_filter', category_filter])
  }
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = { 
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters 
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
  console.log(parameterMap);

  if (currentSearchOffset <= maxOffset)
  {
   $.ajax({
     'url': message.action,
     'data': parameterMap,	
     'cache': true,
     'dataType': 'jsonp',
     'jsonpCallback': 'cb',
     'success': function(data, textStats, XMLHttpRequest) {
      processData(data);
    }
  });
 }

}


 //                             #####                                      #####                                           #                                                  
 // #   # ###### #      #####  #     # ######   ##   #####   ####  #    # #     # #    # #####  #####  ###### #    # ##### #        ####   ####    ##   ##### #  ####  #    # 
 //  # #  #      #      #    # #       #       #  #  #    # #    # #    # #       #    # #    # #    # #      ##   #   #   #       #    # #    #  #  #    #   # #    # ##   # 
 //   #   #####  #      #    #  #####  #####  #    # #    # #      ###### #       #    # #    # #    # #####  # #  #   #   #       #    # #      #    #   #   # #    # # #  # 
 //   #   #      #      #####        # #      ###### #####  #      #    # #       #    # #####  #####  #      #  # #   #   #       #    # #      ######   #   # #    # #  # # 
 //   #   #      #      #      #     # #      #    # #   #  #    # #    # #     # #    # #   #  #   #  #      #   ##   #   #       #    # #    # #    #   #   # #    # #   ## 
 //   #   ###### ###### #       #####  ###### #    # #    #  ####  #    #  #####   ####  #    # #    # ###### #    #   #   #######  ####   ####  #    #   #   #  ####  #    # 

 function yelpSearchCurrentLocation(query, latitude, longitude, currentSearchOffset, sort, category_filter) {

  var terms = query;
  var ll = latitude + "," + longitude;

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['ll', ll]);
  parameters.push(['offset', currentSearchOffset]);
  parameters.push(['sort', sort]);
  if (category_filter!="")
  {
    parameters.push(['category_filter', category_filter])
  }
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = { 
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters 
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
  console.log(parameterMap);

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
     processData(data);
   }
 });
}

// Delete bookmark 
var deleteBookmarkButton = function(id, url){
	var deleteBookmarkBtn =  $("<button class='btn btn-small delete' value=" + id + " title='Delete'><i class='icon-trash'></i></button>");
	deleteBookmarkBtn.click(function(){
		if(confirm("Do you really want to delete this bookmark?")){
			bookmark.deleteItem($(this).val());
			bookmark.updateAddBookmarkBtn(url);
		}
 })	
	return deleteBookmarkBtn
}
// Delete All bookmarks
var deleteAllBookmarks = function(){

	// Confirmation
	if(confirm("Do you really want to delete all bookmarks?")){
		$('#BookmarkPanel .eachResult').each(function(){
			var url = $('.locationUrl', $(this)).val();		
			var id = $('.locationId', $(this)).val();
			bookmark.deleteItem(id);
			bookmark.updateAddBookmarkBtn(url);
		})
		$('.deleteAllBookmarks').remove();
		totalCats = new Array();
		cats = new Array();
	}	
}
// Edit bookmark
var editBookmarkButton = function(id){
	var editBookmarkBtn =  $("<button class='btn btn-small edit' value=" + id + " title='Edit'><i class='icon-edit'></i></button>");
	editBookmarkBtn.click(function(){
		var id = $(this).val();
		var selectedBookmark = bookmark.getBookmarkById(id);
		if(selectedBookmark){
			addBookmarkBtnClick(selectedBookmark, null, true);			
		}
		else {
			alert("There is no such bookmark. Error occurred");
		}

	})	
	return editBookmarkBtn
}