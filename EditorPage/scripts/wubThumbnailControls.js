//TODO:
//On load, Javascript insists on copying the saved properties array by reference, even when using slice.
//Need a deep copy to sever that link.
//Ugh, got a silly work around in place so at least the thumbnail editor will load correctly.

//Add functionality to reorder layers on thumbnail.
//Need to implement way to detect when the video frame has actually updated to the correct image on page load, before drawing thumbnail.

(function($) {
	// plugin definition
	$.fn.wThumbEditor = function(options) {
		//Set the default values.
		var defaults = {
			framerate:30,
			tnWidth:640,
			tnHeight:360,
			tnAspectRatio:640/360
		}
		var options =  $.extend(defaults, options);
		
		// iterate and reformat each matched element
		return this.each(function() {
			var video = this
			var $video_container = $(video).parent();
			
			var tnPropertiesDefault = [{img:video,xPos:0,yPos:0,width:options.tnWidth,height:options.tnHeight}];
			var tnProperties = [];
			
			
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
											'<ul style="float:left;" id="ElementList"></ul>' +
											'<select id="ElementOptions"></select>' +
											'<input type="button" id="ElementAdd" value="Add" />' +
											'<input type="button" id="ElementRemove" value="Remove" />' +
										'</div>' +
										'<div style="clear:both;">' +
											'<input type="button" id="tnElLeftBtn" class="tnEditBtn" tnVal=\'{"xPos":"-10"}\' value="Left" />' +
											'<input type="button" id="tnElRightBtn" class="tnEditBtn" tnVal=\'{"xPos":"10"}\' value="Right" />' +
											'<input type="button" id="tnElUpBtn" class="tnEditBtn" tnVal=\'{"yPos":"-10"}\' value="Up" />' +
											'<input type="button" id="tnElDownBtn" class="tnEditBtn" tnVal=\'{"yPos":"10"}\' value="Down" />' +
											'<input type="button" id="tnElPlusBtn" class="tnEditBtn" tnVal=\'{"width":"1","height":"1"}\' value="+" />' +
											'<input type="button" id="tnElMinusBtn" class="tnEditBtn" tnVal=\'{"width":"-1","height":"-1"}\' value="-" />' +
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
			var $wub_thumb_ElementOpt	= $('#ElementOptions', $video_container.parent());
			var $wub_thumb_ElementAdd	= $('#ElementAdd', $video_container.parent());
			var $wub_thumb_ElementRem	= $('#ElementRemove', $video_container.parent());
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
				if(video.readyState === 4) {
					var sTime = window.opener.thumbnailInfo.thumbnailTime ? window.opener.thumbnailInfo.thumbnailTime : (video.duration/2).toFixed(2);
					$wub_thumb_Time.val(sTime);
					video.currentTime = sTime;
					//It takes a half second for the video to actually update to what the currentTime value is.
					//Otherwise the thumbnail will just load at the offset position set by the video player.
					//Find a better way to deal with this.
					setTimeout(function() {
						tnProperties = loadThumbnail(); 
						drawThumbnail();
					}, 3000);
					loadElementList();
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
				setTimeout(function() {
					tnProperties = tnPropertiesDefault.slice();
					loadElementList();
					drawThumbnail();
				}, 500);
			});
			
			$wub_thumb_Submit.click(function() {
				//Submit the thumbnail information.
				if(/^\d+\.?\d*$/.test($wub_thumb_Time.val())) {
					saveThumbnail();
					window.close();
				} else {
					alert('Invalid timestamp. Make sure the time is entered in seconds.');
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
						});
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
				});
			}
			
			function saveThumbnail() {
				var saveProperties = tnProperties.slice();
				saveProperties.forEach(function(element, index) {
					element.img = (element.img.id == "wubPlayer") ? "Video" : element.img.src.substring(element.img.src.lastIndexOf('/')+1);
				});
				window.opener.thumbnailInfo = { thumbnailTime:$wub_thumb_Time.val(), thumbnailProps:saveProperties.slice()};
			}
			
			function loadThumbnail() {
				//Use stored thumbnail settings, or the defaults.
				if (typeof window.opener.thumbnailInfo.thumbnailProps !== 'undefined') { 
					var tnPropertiesSaved = JSON.parse(JSON.stringify(window.opener.thumbnailInfo.thumbnailProps.slice()));
					tnPropertiesSaved.forEach(function(element, index) {
						element.img = (element.img == "Video") ? video : $('<img src="/thumbnailResources/'+element.img+'"></img>')[0];
					});
				}
				return (tnPropertiesSaved) ? tnPropertiesSaved.slice() : tnPropertiesDefault.slice();
			}
			
			function selectElement() {
				if($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$wub_thumb_ElementList.children('li').removeClass('active');
					$(this).addClass('active');
					$tnElPlusBtn.attr('tnVal','{"width":"'+($(this).attr('elWidth')/$(this).attr('elHeight'))+'","height":"1"}');
					$tnElMinusBtn.attr('tnVal','{"width":"-'+($(this).attr('elWidth')/$(this).attr('elHeight'))+'","height":"-1"}');
				}
			}
			
			function loadElementList() {
				$wub_thumb_ElementList.empty();
				$wub_thumb_ElementOpt.empty();
				
				
				//Populate options list.
				$.getJSON("thumbnailResources/thumbnailresources.json", function(data) {
					data.forEach(function(element) {
						$wub_thumb_ElementOpt.append('<option value="'+element.src+'" elWidth="'+element.width+'" elHeight="'+element.height+'">'+element.title+'</option>');
						$wub_thumb_ElementOpt.after('<img src="/thumbnailResources/'+element.src+'" style="display:none;"></img>'); //Image has to be loaded on to page first for it to be drawn properly the first time. Otherwise only later drawThumbnail() calls will actually render it.
					});
				});
				
				//Add option to thumbnail/element list.
				$wub_thumb_ElementAdd.click(function() {
					//Add to Element List.
					var $optAdd = $(':selected', $wub_thumb_ElementOpt);
					var optAddIndex = parseInt($wub_thumb_ElementList.find(':last').attr('index')) + 1;
					$wub_thumb_ElementList.append('<li index="'+optAddIndex+'" value="'+$optAdd.val()+'" elWidth="'+$optAdd.attr('elWidth')+'" elHeight="'+$optAdd.attr('elHeight')+'">'+$optAdd.text()+'</li>');
					$wub_thumb_ElementList.find(':last').click(selectElement);
					//Add to frame.
					tnProperties.push({img:$('<img src="/thumbnailResources/'+$optAdd.val()+'"></img>')[0],xPos:0,yPos:0,width:17,height:25});
					setInterval(drawThumbnail(),150);
				});
				
				//Remove selected element.
				$wub_thumb_ElementRem.click(function() {
					if($wub_thumb_ElementList.children('li.active').length === 1) {
						var $activeEl = $wub_thumb_ElementList.children('li.active');
						tnProperties.splice($activeEl.attr('index'),1);
						$activeEl.remove();
						$wub_thumb_ElementList.children().each(function (index, element) {
							$(element).attr('index',index);
						});
						drawThumbnail();
					}
				});
				
				//Add elements from saved thumbnails.
				var populateElementList = function() {
					if(tnProperties.length > 0) {
						tnProperties.forEach(function(element, index) {
							var elementTitle = (element.img.id == "wubPlayer") ? "Video Frame" : $wub_thumb_ElementOpt.find('option[value="'+element.img.src.substring(element.img.src.lastIndexOf('/')+1)+'"]').text();
							
							$wub_thumb_ElementList.append('<li index="'+index+'" elWidth="'+element.width+'" elHeight="'+element.height+'">'+elementTitle+'</li>');
						});
						//Be able to select individual elements to modify them.
						$wub_thumb_ElementList.children('li').click(selectElement);
					} else {
						setTimeout(populateElementList, 150);
					}
				};
				populateElementList();
			}
		});
	};
})(jQuery);