/////////////////////////////////////////////////////////////////
// __     __  _         ______ _ _ _            _              //
// \ \   / / | |       |  ____(_) | |          (_)             //
//  \ \_/ /__| |_ __   | |__   _| | |_ ___ _ __ _ _ __   __ _  //
//   \   / _ \ | '_ \  |  __| | | | __/ _ \ '__| | '_ \ / _` | //
//    | |  __/ | |_) | | |    | | | ||  __/ |  | | | | | (_| | //
//    |_|\___|_| .__/  |_|    |_|_|\__\___|_|  |_|_| |_|\__, | //
//             | |                                       __/ | //
//             |_|                                      |___/  //
//                                                             //
/////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//   _____                     _       _____                 _ _        //
//  / ____|                   | |     |  __ \               | | |       //
// | (___   ___  __ _ _ __ ___| |__   | |__) |___  ___ _   _| | |_ ___  //
//  \___ \ / _ \/ _` | '__/ __| '_ \  |  _  // _ \/ __| | | | | __/ __| //
//  ____) |  __/ (_| | | | (__| | | | | | \ \  __/\__ \ |_| | | |_\__ \ //
// |_____/ \___|\__,_|_|  \___|_| |_| |_|  \_\___||___/\__,_|_|\__|___/ //
//////////////////////////////////////////////////////////////////////////

// a global variable that when turned true means that the cut off search filter threshold has been reached.
var searchResultsCriteria = false;

// Search Results Filtering.
function yelpFilterResultsBy(data, filterSearchResultsBy) {

	// Above X stars.
	if(filterSearchResultsBy == "above2Stars")
	{
		return searchResultsAboveXStars(data, 2);
	}
	if(filterSearchResultsBy == "above3Stars")
	{
		return searchResultsAboveXStars(data, 3);
	}
	if(filterSearchResultsBy == "above4Stars")
	{
		return searchResultsAboveXStars(data, 4);
	}
}

// Filter by star rating.
function searchResultsAboveXStars(data, x) {

	// Create an array and initialize the index.
	var filteredSearchResults = new Array();
	var index = 0;

	// Filter the data.
	$(data).each(function(){
		var item = this;

		if(item.rating > x)
		{
			filteredSearchResults[index] = item;
			index++;
		}

	});
	return filteredSearchResults;
}

// Get Search Result Distinct categories.
function getSearchResultDistinctCategories(data) {

		// Create an array and initialize the index.
		var distinctCategories = new Array();
		var distinctCategoriesIndex = 0;

		// Filter the data.
		$(data.businesses).each(function(){
		var item = this.categories;

		$(item).each(function(){
			var itemcategories = this;

			// if(distinctCategories.indexOf(itemcategories) == -1) 
			if(!contains(distinctCategories, itemcategories))
			{
				distinctCategories[distinctCategoriesIndex] = itemcategories;
				distinctCategoriesIndex++;
			}
		});
	});
	return distinctCategories;
}

//////////////////////////////////////////////////////////////////////////////////////////
//  ____              _                         _      _____                 _ _        //
// |  _ \            | |                       | |    |  __ \               | | |       //
// | |_) | ___   ___ | | ___ __ ___   __ _ _ __| | __ | |__) |___  ___ _   _| | |_ ___  //
// |  _ < / _ \ / _ \| |/ / '_ ` _ \ / _` | '__| |/ / |  _  // _ \/ __| | | | | __/ __| //
// | |_) | (_) | (_) |   <| | | | | | (_| | |  |   <  | | \ \  __/\__ \ |_| | | |_\__ \ //
// |____/ \___/ \___/|_|\_\_| |_| |_|\__,_|_|  |_|\_\ |_|  \_\___||___/\__,_|_|\__|___/ //
//																						//
//////////////////////////////////////////////////////////////////////////////////////////

// Bookmarks Filtering.
function yelpFilterBookmarksBy(data, filterBookmarksBy) {

	// Above X stars.
	if(filterBookmarksBy == "above2Stars")
	{
		return bookmarksAboveXStars(data, 2);
	}
	if(filterBookmarksBy == "above3Stars")
	{
		return bookmarksAboveXStars(data, 3);
	}
	if(filterBookmarksBy == "above4Stars")
	{
		return bookmarksAboveXStars(data, 4);
	}
}

// Filter by star rating.
function bookmarksAboveXStars(data, x) {

	// Create an array and initialize the index.
	var filteredBookmarks = new Array();

	// Filter the data.
	$(data).each(function(){
		var item = JSON.parse(this.obj);
		if(item.rating > x)
		{
			filteredBookmarks.push(this);
		} 
	});
	return filteredBookmarks;
}

// Sort by rating.
function sortBookmarksByRating(filteredBookmarks){
	var sortedBookmarks = filteredBookmarks.Sort(function (a,b) {
		return a.obj.rating - b.obj.rating
	})
	return sortedBookmarks;
}

// Get Bookmark Distinct categories.
function getBookmarkDistinctCategories(data) {

		// Create an array and initialize the index.
		var distinctCategories = new Array();
		var distinctCategoriesIndex = 0;

		// Filter the data.
		$(data).each(function(){
		var item = JSON.parse(this.obj).categories;

		$(item).each(function(){
			var itemcategories = this;

			// if(distinctCategories.indexOf(itemcategories) == -1) 
			if(!contains(distinctCategories, itemcategories))
			{
				distinctCategories[distinctCategoriesIndex] = itemcategories;
				distinctCategoriesIndex++;
			}
		});
	});
	return distinctCategories;
}

///////////////////////////////////////////////////////////////////////////////////////
//   _____            _        _             ______ _                           _    //
//  / ____|          | |      (_)           |  ____| |                         | |   //
// | |     ___  _ __ | |_ __ _ _ _ __  ___  | |__  | | ___ _ __ ___   ___ _ __ | |_  //
// | |    / _ \| '_ \| __/ _` | | '_ \/ __| |  __| | |/ _ \ '_ ` _ \ / _ \ '_ \| __| //
// | |___| (_) | | | | || (_| | | | | \__ \ | |____| |  __/ | | | | |  __/ | | | |_  //
//  \_____\___/|_| |_|\__\__,_|_|_| |_|___/ |______|_|\___|_| |_| |_|\___|_| |_|\__| //
//																					 //
///////////////////////////////////////////////////////////////////////////////////////

// Check if an element is contained in an object.
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i][1] == obj[1]) {
           return true;
       }
    }
    return false;
}