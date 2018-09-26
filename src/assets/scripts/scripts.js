$(document).ready(function() {  
	selectItem();
	hoverItem();
});

function selectItem(){
	$('.item--js').click(function() {
		var selectElement = $(this);
		if(selectElement.hasClass('item--disabled')){
			return;
		}		
		$(selectElement).toggleClass('item--active');	
		var title = selectElement.children(".item__info").children('.item__title--js');	
		title.toggleClass('item__title--color');
		title.text('Сказочное заморское яство');
		selectElement.children('.item__description--js').toggleClass('hidden');
	});
}

function hoverItem(){
	$('.item--js').mouseenter(function() {
		var hoverElement = $(this);
		if(hoverElement.hasClass('item--active')){
			var title = hoverElement.children(".item__info").children('.item__title--js');
			title.addClass('item__title--color');
			title.text('Котэ не одобряет?');
		}	
	});
	$('.item--js').mouseleave(function() {
		var hoverElement = $(this);
		var titleContent = hoverElement.children(".item__info").children('.item__title--js');
		if(hoverElement.hasClass('item--active')){
			titleContent.removeClass('item__title--color');
			titleContent.text('Сказочное заморское яство');
		}	
	});
}
