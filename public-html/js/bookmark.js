/*
* Bookmark class.   
* User can add, delete and retrieve bookmark which is saved on local storage
* 
* User Interface Design final project
* 
* Seungwoo Lee
*/

// Bookmark object initialization 
if(!bookmark) var bookmark = {};

// Current default user is Jim
bookmark.user = 'Jim';

// Max tag numbers	
bookmark.maxTagCnt = 20;

// Current user change
bookmark.userChange = function(selectDOM){
	this.user = $(selectDOM).val();
	$('#searchResultPanel').empty();
	$('#categorySelect').empty();
	$('#categorySelect').append("<h2>Search</h2>");

	updateBookmarks();
	
}

// Get local storage value. You can select the type object(default), string
bookmark.getItem = function(key, type){

	type = typeof type !== "undefined" ? type : "object";
	var userStorage = JSON.parse(localStorage.getItem(this.user));
	
	if(type == "JSON") 
		return userStorage? JSON.stringify(userStorage[key]) : null;
	else if(type == "object") 
		return userStorage? userStorage[key] : null;
	else
		return false;
}
// Add new Tags up to max number
bookmark.addNewTag = function(newList){

	var currentTagList = this.getItem("tags", "object");
	for(var cnt = 0;cnt < newList.length; cnt++){
		if(currentTagList.length >= this.maxTagCnt) {
			alert("Tag Overflow"); 
			break;
		}
		if(currentTagList.indexOf(newList[cnt]) == -1) currentTagList.push(newList[cnt]);
	}
	return currentTagList;
}	
// Add bookmark 
bookmark.add = function(item, tags, comment) {
	var newBookmark;
	// Information to be added
	if(typeof(item) == "object") {
		newBookmark = JSON.stringify(item);	
	}
	else if (typeof(item) == "string") {
		newBookmark = item;
	}
	// Retrieve current bookmark object
	var currentBookmarkObj = this.getItem("bookmarks", "object");

	var tagList = tags.split('|');
	var tagListFinal = tagList.slice(1,tagList.length);
	while(tagListFinal.indexOf("") != -1)
		tagListFinal.pop();

	// If it is first, just make it
	if(!currentBookmarkObj){
		var currentBookmark = {"pushCnt" : 1, "tags" : tagListFinal, "bookmarks" : new Array({ "id" : 1,  "obj" : newBookmark, "tags" : tagListFinal, "comment" : comment})};
		localStorage.setItem(this.user, JSON.stringify(currentBookmark));	
	}	
	// If already exists, just add it
	else {
		var currentPushCnt = this.getItem("pushCnt", "JSON");
		var newPushCnt = parseInt(currentPushCnt) + 1;
		currentBookmarkObj.push({"id" : newPushCnt, "obj" : newBookmark, "tags" : tagListFinal, "comment" : comment});		
		
		var currentTags = this.getItem("tags","object");
		
		var currentBookmark = {"pushCnt" : newPushCnt, "tags" : this.addNewTag(tagListFinal), "bookmarks" : currentBookmarkObj};
		localStorage.setItem(this.user, JSON.stringify(currentBookmark))
	}
}
// Delete specific bookmark with id (This id is automatically made when adding bookmark)
bookmark.deleteItem = function(id) {
	
	var currentBookmarkObj = this.getItem("bookmarks", "object");
	var tags;
	var categories;
	// Find the specific bookmark by id	
	for(var cnt = 0; cnt < currentBookmarkObj.length;cnt++){
		if(currentBookmarkObj[cnt]["id"] == id){
			// Pop it
			tags = currentBookmarkObj[cnt].tags;
			categories = JSON.parse(currentBookmarkObj[cnt].obj).categories;
			currentBookmarkObj.splice(cnt,1);
			break;
		}
	}
	if(tags != null){
		var alreadyTags = [];
		var alreadyCategories = [];
		for(var cnt = 0; cnt < currentBookmarkObj.length;cnt++){
			if(currentBookmarkObj[cnt]["id"] != id){
				var otherTags = currentBookmarkObj[cnt].tags;
				var otherCategories = JSON.parse(currentBookmarkObj[cnt].obj).categories;
				for(var i = 0;i < tags.length; i++){
					if(otherTags.indexOf(tags[i]) > -1) alreadyTags.push(tags[i]);
				}
				for(var i = 0;i < otherCategories.length; i++){
					if(otherCategories.indexOf(categories[i]) > -1) alreadyCategories.push(categories[i]);
				}
			}
		}			
	}
	tags = tags.filter(function(i){ return (alreadyTags.indexOf(i) == -1)});
	var currentTags = this.getItem("tags");
	for(var cnt = 0; cnt < tags.length; cnt++){
		currentTags.splice(currentTags.indexOf(tags[cnt]),1);	
	}
	categories = categories.filter(function(i){ return (alreadyCategories.indexOf(i) == -1)});	
	for(var cnt = 0; cnt < categories.length; cnt++){
		cats.splice(cats.indexOf(categories[cnt]),1);	
		totalCats.splice(totalCats.indexOf(categories[cnt]),1);	
	}	
	var currentBookmark = {"pushCnt" : this.getItem("pushCnt"), "tags" : currentTags, "bookmarks" : currentBookmarkObj};
	// Set new bookmark
	localStorage.setItem(this.user, JSON.stringify(currentBookmark));
	updateBookmarks();
}
// Clear all bookmark
bookmark.clear = function() { 
	localStorage.clear();
}
// Check if the result is already bookmarked
bookmark.alreadyBookmark = function(result){
	var resultId = result.id;
	var bookmarks = this.getItem("bookmarks", "object");
	if(bookmarks){
		for(var cnt = 0; cnt < bookmarks.length ; cnt++){
			if(JSON.parse(bookmarks[cnt].obj).id == resultId) return true;
		}
	}
	return false;
}
// If user deletes bookmark, enables adding bookmark button if exists in result panel
bookmark.updateAddBookmarkBtn = function(url){
	$('#searchResultPanel .eachResult input[value="' + url + '"]').each(function(){		
		$('.addBookmark', $(this).parent()).removeClass('disabled').removeAttr('disabled');
	})
}
// Get one bookmark by ID
bookmark.getBookmarkById = function(id){
	var currentBookmarkObj = this.getItem("bookmarks", "object");
	var selectedBookmark;
	// Find the specific bookmark by id	
	for(var cnt = 0; cnt < currentBookmarkObj.length;cnt++){
		if(currentBookmarkObj[cnt]["id"] == id){
			selectedBookmark = currentBookmarkObj[cnt];
			break;
		}
	}	
	return selectedBookmark;
}
// Updating Tag Color
bookmark.updateTagColor = function(deletedBookmark){
	var categories = deletedBookmark.categories;	
}
/* To do 
   1. Make retrieving function according to map, display, and etc.
*/ 
 