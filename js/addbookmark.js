/*
 * Add Bookmark Javascript 
 * Seungwoo Lee
 */
var tagConflictText = "Tag already exists!";
var modifyConflictText = "Please change the conflicted tag name!";
var blankText = "Type any text to make tag"

var addBookmarkBtnClick = function(location, addBtn, edit){

	// Get Location to be added
	if(typeof location == "string") location = JSON.parse(location);
	
	// Parse current Bookmarks
	var currentTags = bookmark.getItem("tags");
	
	// Initilization previous addbookmark panel
	$('.addTag .addInformation .tagSelector').empty();
	$('.addTag .addInformation .tag').remove();
	$('.addComment textarea').val('');
	$('.conflictWarning').remove();	
	$('.addTag .tag').remove();
	$('#newTagInput').val('');
	if(edit) 
		$('#addBookmarkModal h2').text("Edit Bookmark");		
	else
		$('#addBookmarkModal h2').text("Add Bookmark");		
	// Make recent tag list selector
	var tagSelector = $('.addTag .addInformation select.tagSelector').append("<option value='default'>Select from existing tag</option>");

	// If current tags exist, make options
	if(currentTags && currentTags.length > 0){
		for(var cnt = 0; cnt < currentTags.length; cnt ++){
			tagSelector.append("<option value='" + currentTags[cnt] + "'>" + currentTags[cnt] + "</option>");         
		}
		// Unbind previous change event
		tagSelector.unbind('change');
		// Attach new change event
		tagSelector.change(function(){
			if($(this).val() != 'default'){
				
				// Add on the selected tag panel
				var selectedTag = $(this).val();
				var existingTag = $("<input class='tag existing' value='" + selectedTag + "' readonly>").click(function(){
					// When it is clicked, disappear it
					$(this).remove();
					tagSelector.append("<option value='" + selectedTag + "'>" + selectedTag + "</option>");         					
					$('.addTag .addInformation .tagSelector option[value="default"]').text("Select from existing tag");
				});
				
				// Add it
				$('.addTag .addInformation .currentTags').after(existingTag);
				// Remove option on the selector
				$('.addTag .addInformation .tagSelector option[value="' + $(this).val() + '"]').remove();
				// Set selector default option
				$(this).val('default');
				
				// If there is nothing, display no more tag text
				if($('.addTag .addInformation .tagSelector option').length == 1) $('.addTag .addInformation .tagSelector option[value="default"]').text("No tag anymore");
			}
		});		
	}
	else {
		$('.addTag .addInformation .tagSelector option[value="default"]').text("No tag anymore");
	}
	// Make one input text 
	//var inputTag = $("<input class='tag'>");
	var newInputTag = $("#newTagInput");
	// Attach conflict check event
	bindConflictWarningEvent(newInputTag, currentTags);
	
	// Make add input DOM button
	$('#addTagBtn').unbind("click");
	var addTagBtn = $('#addTagBtn').click(function(){
		if($('.conflictWarning').length && newInputTag.val() != '') {
			$('.conflictWarning').text(modifyConflictText);
			setTimeout(function(){
				$('.conflictWarning').text(tagConflictText);
			},2000);
		}
		else if(newInputTag.val() == ''){
			if(!$('.conflictWarning').length){
				$('<div class="conflictWarning" style="display:none">' + blankText + '</div>').insertBefore($('.addComment')).fadeIn();	
			} 
			else {
				$('.conflictWarning').text(blankText);
			}
			setTimeout(function(){
				$('.conflictWarning').remove();
			},2000);			
		}
		else { 
			var inputTag = $("<input class='tag'/>").click(function(){
				$(this).remove();
			});
			inputTag.val($('#newTagInput').val());

			//bindConflictWarningEvent(inputTag, currentTags);
			$(".candidateTags").append(inputTag);
			$('#newTagInput').val('');
			
			//bindConflictWarningEvent($("#newTagInput"), currentTags);
			//$(this).hide();
		}
	});
	
	//$('.addTag .addInformation .currentTags').after(addTagBtn).after(inputTag);       
	$("#addBookmarkModal").modal("show");
	
	// For Editing Bookmark function
	// Adding already attached tags
	// Should be implemented above if we have time
	if(!addBtn && edit && location){
		for(var cnt=0; cnt < location.tags.length; cnt++){
			tagSelector.val(location.tags[cnt]).trigger("change");
		}
		$('.addComment textarea').val(location.comment);
	}
		
	$("#addBookmarkModal .okay").unbind("click");
	$("#addBookmarkModal .okay").click(function(){
		if($('.conflictWarning').length) {
			alert('Please modify the conflict tag');
			return false;
		}
	    var tags = '';
	    $('.tag').each(function(){
	    	tags += ('|' + $(this).val());
	    });
	    var comment = $('.addComment textarea').val();
	    if(addBtn) {
	    	callAddBookmark(location, tags, comment, addBtn);
	    }
	    else if(edit) {
	    	if(confirm("Do you want to edit it? Modified bookmark will be displayed at last element")){
		    	bookmark.deleteItem(location.id);
		    	callAddBookmark(JSON.parse(location.obj), tags, comment, addBtn);		
	    	}		    
	    }
    });
    $("#addBookmarkModal .close").click(function(){  
    	return true;
    });    
}
var checkTagValidation = function(tagObj, currentTags){
	var result = true;
	var cnt = $('.addTag .tag').length;
	var i = 0;
	$('.addTag .tag').each(function(){
		if(i < cnt && $(this).val() == tagObj.val() && tagObj.val() != '') {
			result = false;			
		}
		i += 1;
	});	
	if(!result) return result;
	if(currentTags){
		for(var cnt = 0; cnt < currentTags.length; cnt ++){
			if(tagObj.val() == currentTags[cnt]) return false; 
		}		
	}
	return true;	
}

var bindConflictWarningEvent = function(inputTag, currentTags){
	inputTag.keyup(function(e){
		if(e.keyCode == 13) {
			//$('#addTagBtn').trigger('click');
		}
		else {		
			if($(this).val() != ''){
				if(!checkTagValidation($(this), currentTags)){
					if(!$('.conflictWarning').length) {
						$('<div class="conflictWarning" style="display:none">' + tagConflictText + '</div>').insertBefore($('.addComment')).fadeIn();
					}
					$(this).addClass('conflict');
					//$('#addTagBtn').fadeOut();
				}
				else {
					if($(this).hasClass('conflict')) {
						$('.conflictWarning').remove();
						$(this).removeClass('conflict');
					}
					//$('#addTagBtn').fadeIn();				
				}
			}
			else{
				//$('#addTagBtn').fadeOut();
			}
		}
	});
}
