// load magnific popup
$('div.certificates-flex').magnificPopup({ 
  type: 'image',
  delegate: 'img',
  
  gallery:{enabled:true},
  callbacks: {
	 elementParse: function(item) { item.src = item.el.attr('src');}
  }
});

// Insert YandexMap
ymaps.ready(init);

var myMap, 
	myPlacemark;

function init(){ 
	yandexMap = new ymaps.Map('contacts_map', {
		center: [60.02240708805876,30.251026103179928],
		zoom: 17,
		controls: []
	}, {
		suppressMapOpenBlock: false,
		yandexMapDisablePoiInteractivity: true
	}); 

	yandexMap.behaviors.disable(['drag', 'rightMouseButtonMagnifier', 'scrollZoom']);
	
	yandexMap.controls.add(new ymaps.control.FullscreenControl({
		options: {
			float: 'left'
		}
	}));
	yandexMap.controls.add(new ymaps.control.ZoomControl({
		options: {
			size: "small"
		}
	}));

	myPlacemark = new ymaps.Placemark([60.02294406407761,30.250317999999986], {
		iconCaption: 'проспект Королёва, 48'
	}, {
		 preset: 'islands#circleDotIcon'
	});
	
	yandexMap.geoObjects.add(myPlacemark);
}

// changed visible steps work with conpany
function changedTypeCompany(element) {

var value,
	elements;

	value = element.getAttribute('value');
	elements = document.querySelectorAll('.trade-company, .government-company');

	for (var i = 0; i < elements.length; i++) {
		if (elements[i].classList.contains(value)) {
			elements[i].classList.remove('hidden');
		} else {
			elements[i].classList.add('hidden');
		}
	}

}
