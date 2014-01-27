$(function() {
	$(".b-ill").each(function() {
		new Ill(this);
	});
	
	$("form").each(function() {
		new Form(this);
	});
	
	fixedHeader();
	
	window.bTopBanner = new RotateBanner("b-theme-switch");
	
	deleteOrder();
});

function deleteOrder() {
	$(".b-order__table .b-delete").click(function() {
		if(confirm("Удалить из корзины?")) return true;
		return false;
	});
}

function RotateBanner(id) {
	var self = this;
	
	init();
	
	function init() {
		initVarsAndElems();
		makeHtml();
		handleEvents();
	}
	
	function initVarsAndElems() {
		self.$elem = $("#" + id);
		self.$items = self.$elem.find("." + id + "__themes__item").addClass("b-rotate-banner__item");
		self.$elem.data("RotateBanner", self);
		self.activeItemIndex = 0;
		self.$navBar = self.$elem.find(".b-theme-switch__nav");
		self.delay = 5000;
	}
	
	function makeHtml() {
		makeNavBar();
		self.$items.hide();
		showItem(self.activeItemIndex);
		
		function makeNavBar() {
			self.$navBar.empty();
			self.$items.each(function(index) {
				self.$navBar.append('<a href="#" class="b-theme-switch__nav__item" rel="' + index + '">' + (index+1) + '</a>');
			});
			
			self.$navBarItems = self.$navBar.find("a");
			
			if(self.$items.size() == 1) {
				self.$navBar.hide();
			}
		}
	}
	
	function showItem(num) {
		self.$navBarItems.removeClass("i-active");
		self.$navBar.find("a:eq(" + num + ")").addClass("i-active");
		self.$items.fadeOut(1000);
		self.$elem.find("." + id + "__themes__item:eq(" + num + ")").fadeIn(1000);
	}
	
	function handleEvents() {
		if(self.$items.size() == 1) return;
		
		self.$navBarItems.click(clickNavBarItem);
		self.$elem.mouseenter(enterBanner).mouseleave(leaveBanner);
		self.interval = setInterval(timeoutFunction, self.delay);
		
		function enterBanner() {
			clearInterval(self.interval);
			self.interval = "mouseenter";
		}
		
		function leaveBanner() {
			self.interval = setInterval(timeoutFunction, self.delay);
		}
		
		function clickNavBarItem() {
			self.activeItemIndex = parseInt($(this).attr("rel"), 10);
			showItem(self.activeItemIndex);
			
			if(self.interval == "mouseenter") return false;
			
			if(self.interval) {
				clearInterval(self.interval);
			}
			self.interval = setInterval(timeoutFunction, self.delay);
			return false;
		}
		
		function timeoutFunction() {
			var $activeItem = self.$elem.find(".b-rotate-banner__item:eq(" + self.activeItemIndex + ")");
			
			if($activeItem.next(".b-rotate-banner__item").is(".b-theme-switch__themes__item")) {
				self.activeItemIndex++;
			} else {
				self.activeItemIndex = 0;
			}
			showItem(self.activeItemIndex);
		}
	}
}

function fixedHeader() {
	$(window).bind("scroll", scrollWindow);
	
	var $header = $(".b-header");
	var headerHeight = $header.outerHeight();
	var headerBottomBorder = $header.offset().top + headerHeight;
	var backAnimationFlag = false;
	
	function scrollWindow(e) {
		var scrolled = getScrolled();
		if(scrolled >= headerBottomBorder && !$header.hasClass("i-fixed")) {
			$header
				.after('<div class="b-header-fixed"></div>')
				.addClass("i-fixed")
				.stop().animate({top: 0});
		} else if(scrolled <= headerBottomBorder && $header.hasClass("i-fixed") && !backAnimationFlag) {
			backAnimationFlag = true;
				$(".b-header-fixed").remove();
			$header.removeClass("i-fixed").css({top: "-100px"});
			$header.stop().animate({top: "0"}, 500, function() {
				$header.removeAttr("style");
				backAnimationFlag = false;
			});
			
		}
	}
	
	function getScrolled() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}
}


function Ill(elem) {
	var self = this;
	
	init();
	
	function init() {
		initVarsAndElems();
		makeHtml();
		handleEvents();
	}
	
	function initVarsAndElems() {
		self.$elem = $(elem);
		self.$elem.data("Ill", self);
		self.$nav = self.$elem.find(".b-ill__color-nav");
		self.$navItems = self.$elem.find(".b-ill__color-nav__item");
		self.$image = self.$elem.find(".b-ill__image");
	}	
	
	function makeHtml() {
		var color = self.$nav.find(".b-ill__color-nav__item.i-active").attr("data-color");
		self.$image.find("img[data-color=" + color + "]").fadeIn();
	}
	
	function handleEvents() {
		self.$navItems.click(illNavItemClick);
	}
	
	function illNavItemClick() {
		var $navItem = $(this);
		var color = $navItem.attr("data-color");
		self.$image.find("img:visible").fadeOut().end().find("img[data-color=" + color + "]").fadeIn();
		self.$nav.find(".i-active").animate({marginLeft: 0}, function() {
			$(this).removeClass("i-active");
		});
		$navItem.animate({marginLeft: "45px"}, function() {
			$(this).addClass("i-active");
		});
	}
}

function Form(elem) {
	var self = this;
	
	init();
	
	function init() {
		initVarsAndElems();
		handleEvents();
	}
	
	function initVarsAndElems() {
		self.$elem = $(elem);
		self.$elem.data("Form", self);
		self.submitFlag = 0;
		self.firstElement = null;
		self.$submitButton = self.$elem.find(".b-form-submit .b-button");
	}
	
	function handleEvents() {
		self.$submitButton.click(clickSubmitButton);
		self.$elem.submit(submitForm);
	}
	
	function clickSubmitButton(e) {
		self.$elem.submit();
		e.preventDefault();
	}
	
	function submitForm() {
		return isValid();
	}
	
	function isValid() {
		return check();
	
		function setAttention($elem) {
			$elem.closest(".b-form-field").addClass("i-attention");
			
			if(self.submitFlag == 0) {
				self.firstElement = $elem;
			}
			self.submitFlag = 1;
		}
		
		function removeAttention($elem) {
			$elem.closest(".b-form-field").removeClass("i-attention");
		}
		
		function check() {
			self.submitFlag = 0;
			self.firstElement = null;
			
			checkSpecialTypes();
			checkRequiredOr();
			checkEqual();
			checkEmpty();
			
			if (self.submitFlag == 0) return true;
			
			var scrolled = window.pageYOffset || document.documentElement.scrollTop;
			if((self.firstElement.offset().top - scrolled) < 0) {
				$.scrollTo(self.firstElement.parent(), 10);
				if(self.firstElement != null) {
					self.firstElement.focus();
				}
			}
			return false;						
		}
		
		function checkEqual() {
			var orFieldsObject = {};
			self.$elem.find("[data-equal]").each(function() {
				var $filed = $(this),
					data = $filed.attr("data-equal");
					
				if(!orFieldsObject[data]) {
					orFieldsObject[data] = self.$elem.find("[data-equal=" + data + "]");
				}
			});
			
			var flag;
			for(var key in orFieldsObject) {
				flag = true;
				
				var value = $.trim($(orFieldsObject[key][0]).val());
				orFieldsObject[key].each(function() {
					if($.trim($(this).val()) != value) {
						flag = false;
					}
				});
				
				if(!flag) {
					orFieldsObject[key].each(function() {
						setAttention($(this));
					});
				}
				else {
					orFieldsObject[key].each(function() {
						removeAttention($(this));
					});
				}
			}
		}
		
		function checkEmpty() {
			self.$elem.find(".b-select.i-required").each(function() {
				if($(this).find("input:hidden").val() == "") {
					setAttention($(this));
				} else {
					removeAttention($(this));
				}
			});
			self.$elem.find("[required]").each(function() {
				var $field = $(this),
					$val = $.trim($field.val());
				
				if ($field.is("[type=radio]")) {
					if($field.closest(".b-form-field").find("input:checked").size() == 0) {
						setAttention($field);
					}
				}
				else if ($field.is("[type=checkbox]")) {
					if(!$field.is(":checked")) {
						setAttention($field);
					} else {
						removeAttention($field);
					}
				}
				else if ($field.is("[data-equal]")) {
					if($.trim($field.val()) == "") {
						setAttention($field);
					}
				}
				else if ($val == "") {
					setAttention($field);
				}
				else if(!$field.is("[type=email]") && !$field.is("[type=tel]") && !$field.is("[type=number]") && !$field.is("[type=url]")) {
					removeAttention($field);
				}
			});
		}
		
		function checkSpecialTypes() {
			checkPasswordType();
			checkEmailType();
			checkTelType();
			checkNumberType();
			checkUrlType();
			
			function checkPasswordType() {
				self.$elem.find("input:visible[type=password]").each(function() {
					var $field = $(this),
						$val = $.trim($field.val()),
						num = 6;
					
					if ($val.length < num) {
						setAttention($field);
					}
					else {
						removeAttention($field);
					}
				});
			}
			
			function checkEmailType() {
				self.$elem.find("[type=email]").each(function() {
					var $field = $(this),
						$val = $.trim($field.val()),
						mailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
					
					if ($val != "" && !mailRegex.test($val)) {
						setAttention($field);
					}
					else {
						removeAttention($field);
					}
				});
			}
			
			function checkTelType() {
				self.$elem.find("[type=tel]").each(function() {
					var $field = $(this),
						$val = $.trim($field.val()),
						phoneRegex = /^([0-9-()\++\s]{5,})$/i;
					
					if ($val != "" && !phoneRegex.test($val)) {
						setAttention($field);
					}
					else {
						removeAttention($field);
					}
				});
			}
			
			function checkNumberType() {
				self.$elem.find("[type=number]").each(function() {
					var $field = $(this),
						$val = $.trim($field.val()),
						numRegex = /^([0-9\s\.,]+)$/i;
					
					if ($val != "" && !numRegex.test($val)) {
						setAttention($field);
					}
					else {
						removeAttention($field);
					}
				});
			}
			
			function checkUrlType() {
				self.$elem.find("[type=url]").each(function() {
					var $field = $(this),
						$val = $.trim($field.val()),
						urlRegex = /^((https?:\/\/)?(www\.)?([-a-z0-9]+\.)+[a-z]{2,})$/i;
					
					if ($val != "" && !urlRegex.test($val)) {
						setAttention($field);
					}
					else {
						removeAttention($field);
					}
				});
			}
			
		}
		
		function checkRequiredOr() {
			var orFieldsObject = {};
			self.$elem.find("[data-required-or]").each(function() {
				var $filed = $(this),
					data = $filed.attr("data-required-or");
					
				if(!orFieldsObject[data]) {
					orFieldsObject[data] = self.$elem.find("[data-required-or=" + data + "]");
				}							
			});
			
			var counter;
			for(var key in orFieldsObject) {
				counter = 0;
				
				orFieldsObject[key].each(function() {
					if($.trim($(this).val()) != "") {
						counter++;
					}
				});
				
				if(counter == 0) {
					orFieldsObject[key].each(function() {
						setAttention($(this));
					});
				}
				else {
					orFieldsObject[key].each(function() {
						removeAttention($(this));
					});
				}
			}
		}
	} 
}

/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);