//TODO:
//Create proper save/load functions to convert tnPropertiesSaved to window.opener.thumbnailInfo.thumbnailProps and back
//Issue is the "img" property, it doesn't convert properly. 
//Need to instead save an ID back to thumbnailPropers, and convert it back into the appropriate javascript object.

(function($) {
	// plugin definition
	$.fn.wThumbEditor = function(options) {
		//Set the default values.
		var defaults = {
			framerate:30,
			tnWidth:640,
			tnHeight:264,
			tnAspectRatio:640/264
		}
		var options =  $.extend(defaults, options);
		
		// iterate and reformat each matched element
		return this.each(function() {
			var video = this
			var $video_container = $(video).parent();
			
			var tnPropertiesDefault = [{img:video,xPos:0,yPos:0,width:options.tnWidth,height:options.tnHeight}];
			var tnPropertiesSaved = window.opener.thumbnailInfo.thumbnailProps;
			if (typeof tnPropertiesSaved !== 'undefined') { tnPropertiesSaved.img = video; }
			
			//Use stored thumbnail settings, or the defaults.
			var tnProperties = (tnPropertiesSaved) ? tnPropertiesSaved : tnPropertiesDefault;
			
			
			//create html structure
			var $thumbnail_selector = $('<div class="wub-video-thumbnailSelector" >' +
										'<input type="button" id="PrevFrameBtn" value="Previous Frame" />' +
										'<input type="button" id="SelectFrameBtn" value="Select Thumbnail" />' +
										'<input id="ThumbnailTime" />' +
										'<input type="button" id="NextFrameBtn" value="Next Frame" />' +
									'</div>');
			
			var $thumbnail_editor = $('<div id="ThumbnailEditorPane" style="clear:both; padding-top:5px;">' +
										'<div>' +
											'<canvas style="float:left;" id="ThumbnailPreview" width="'+options.tnWidth+'" height="'+options.tnHeight+'"></canvas>' +
											'<ul style="float:left;" id="ElementList"><li index="0">Video Frame</li></ul>' +
										'</div>' +
										'<div style="clear:both;">' +
											'<input type="button" id="tnElLeftBtn" class="tnEditBtn" tnVal=\'{"xPos":"-1"}\' value="Left" />' +
											'<input type="button" id="tnElRightBtn" class="tnEditBtn" tnVal=\'{"xPos":"1"}\' value="Right" />' +
											'<input type="button" id="tnElUpBtn" class="tnEditBtn" tnVal=\'{"yPos":"-1"}\' value="Up" />' +
											'<input type="button" id="tnElDownBtn" class="tnEditBtn" tnVal=\'{"yPos":"1"}\' value="Down" />' +
											'<input type="button" id="tnElPlusBtn" class="tnEditBtn" tnVal=\'{"width":"'+options.tnAspectRatio+'","height":"1"}\' value="+" />' +
											'<input type="button" id="tnElMinusBtn" class="tnEditBtn" tnVal=\'{"width":"-'+options.tnAspectRatio+'","height":"-1"}\' value="-" />' +
										'</div>' +
										'<div style="clear:both;">' + 
											'<input type="button" id="ResetButton" value="Reset"/>' +
											'<input type="button" id="SubmitButton" value="Submit"/>' +
										'</div>' +
									'</div>');
			
			$video_container.append($thumbnail_selector);
			$video_container.after($thumbnail_editor);
			
			//get new elements
			var $thumbnail_selector 	= $('.wub-video-thumbnailSelector', $video_container);
			var $wub_thumb_pFrame 		= $('#PrevFrameBtn', $thumbnail_selector);
			var $wub_thumb_selectFrame 	= $('#SelectFrameBtn', $thumbnail_selector);
			var $wub_thumb_Time 		= $('#ThumbnailTime', $thumbnail_selector);
			var $wub_thumb_nFrame		= $('#NextFrameBtn', $thumbnail_selector);
			
			var $wub_thumb_Details 		= $('#ThumbnailEditorPane', $video_container.parent());
			var $wub_thumb_Canvas		= $('#ThumbnailPreview', $video_container.parent());
			var $wub_thumb_ElementList	= $('#ElementList', $video_container.parent());
			var $tnElLeftBtn			= $('#tnElLeftBtn', $video_container.parent());
			var $tnElRightBtn			= $('#tnElRightBtn', $video_container.parent());
			var $tnElUpBtn				= $('#tnElUpBtn', $video_container.parent());
			var $tnElDownBtn			= $('#tnElDownBtn', $video_container.parent());
			var $tnElPlusBtn			= $('#tnElPlusBtn', $video_container.parent());
			var $tnElMinusBtn			= $('#tnElMinusBtn', $video_container.parent());
			var $wub_thumb_Reset 		= $('#ResetButton', $wub_thumb_Details);
			var $wub_thumb_Submit 		= $('#SubmitButton', $wub_thumb_Details);
			
			//Configure Thumbnail Selector Controls
			var setDefaults = function() {
				if(video.readyState) {
					var sTime = window.opener.thumbnailInfo.thumbnailTime ? window.opener.thumbnailInfo.thumbnailTime : (video.duration/2).toFixed(2);
					$wub_thumb_Time.val(sTime);
					video.currentTime = sTime;
					drawThumbnail();
				} else {
					setTimeout(setDefaults, 150);
				}
			};
			setDefaults();
			
			$wub_thumb_pFrame.click(function() {
				//Move to next previous in video;
				video.currentTime -= 1/options.framerate;
			});
			$wub_thumb_nFrame.click(function() {
				//Move to next frame in video;
				video.currentTime += 1/options.framerate;
			});
			$wub_thumb_selectFrame.click(function() {
				//Select the frame at the current time for use as the thumbnail;
				$wub_thumb_Time.val(video.currentTime.toFixed(2));
				drawThumbnail();
			});
			
			$wub_thumb_Reset.click(function() {
				$wub_thumb_Time.val((video.duration/2).toFixed(2));
				video.currentTime = (video.duration/2).toFixed(2);
				tnProperties = tnPropertiesDefault;
				drawThumbnail();
			});
			
			$wub_thumb_Submit.click(function() {
				//Submit the thumbnail information.
				if(/^\d+\.?\d*$/.test($wub_thumb_Time.val())) {
					window.opener.thumbnailInfo = { thumbnailTime:$wub_thumb_Time.val(), thumbnailProps:tnProperties};
					window.opener.thumbnailInfo.thumbnailProps
					window.close();
				} else {
					alert('Invalid timestamp. Make sure the time is entered in seconds.')
				}
			});
			
			//Select element from list to modify.
			$wub_thumb_ElementList.children('li').click(function() {
				if($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$wub_thumb_ElementList.children('li').removeClass('active');
					$(this).addClass('active');
				}
			});
			
			//Bind the move/scale element buttons.
			var heldinterval;
			$wub_thumb_Details.find('.tnEditBtn').mousedown(function() {
				if($wub_thumb_ElementList.children('li.active').length === 1) {
					var $activeEl = $wub_thumb_ElementList.children('li.active');
					var editProps = JSON.parse($(this).attr('tnVal'));
					heldinterval = setInterval(function() { 
						Object.keys(editProps).forEach(function(key) {
							tnProperties[$activeEl.attr('index')][key] += parseFloat(editProps[key]);
						})
						drawThumbnail(); 
					}, 100);
				}
			}).bind('mouseup mouseleave', function() {
				clearInterval(heldinterval);
			});
			
			function drawThumbnail() {
				//Get the canvas context for drawing.
				var canvas = $wub_thumb_Canvas[0];
				var context = canvas.getContext('2d');
				
				//Clear the canvas.
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.rect(0, 0, canvas.width, canvas.height);
				context.fillStyle="black";
				context.fill();
				
				//Draw the video contents into the canvas x, y, width, height
				tnProperties.forEach(function(element) {
					context.drawImage(element.img,element.xPos,element.yPos,element.width,element.height);
				})
			}
		});
	};
})(jQuery);