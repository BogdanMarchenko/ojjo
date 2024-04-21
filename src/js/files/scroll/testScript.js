let productsQuanityArr = [];

let buttonShowMore = document.querySelector('.products__more');


window.onload = function () {

	let checkedOptionValues = {
		brand: 'Brand',
		price: 'Price',
		audience: 'Audience',
		collection: 'Collection',
		season: 'Season',
		event: 'Event'
	};
	getProductsOfJson(checkedOptionValues)

	document.addEventListener("click", documentActions);
	// Actions (делегирование события cLick)
	function documentActions(e) {
		const targetElement = e.target;

		// мой код селект
		if (targetElement.closest('.products__selects')) {
			let checkedOptionValues = {
				brand: 'Brand',
				price: 'Price',
				audience: 'Audience',
				collection: 'Collection',
				season: 'Season',
				event: 'Event'
			};
			if (targetElement.closest('[data-id="1"]')) {
				const data = document.querySelector('[data-id="1"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.brand = checkedOptionValue;
			}
			if (targetElement.closest('[data-id="2"]')) {
				const data = document.querySelector('[data-id="2"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.price = checkedOptionValue;
			}
			if (targetElement.closest('[data-id="3"]')) {
				const data = document.querySelector('[data-id="3"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.audience = checkedOptionValue;
			}
			if (targetElement.closest('[data-id="4"]')) {
				const data = document.querySelector('[data-id="4"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.collection = checkedOptionValue;
			}
			if (targetElement.closest('[data-id="5"]')) {
				const data = document.querySelector('[data-id="5"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.season = checkedOptionValue;
			}
			if (targetElement.closest('[data-id="6"]')) {
				const data = document.querySelector('[data-id="6"]');
				const checkedOptionValue = data.querySelector('.select__content').textContent;
				checkedOptionValues.event = checkedOptionValue;
			}
			getProductsOfJson(checkedOptionValues);
		}
	}

	// load Products by select option
	async function getProductsOfJson(checkedOptionValues) {
		const file = "files/json/products.json";
		let response = await fetch(file, {
			method: "GET"
		});
		if (response.ok) {
			let result = await response.json();
			loadProductsOfJson(result, checkedOptionValues);
		} else {
			alert("Ошибка");
		}

	}
	// функция обработки json формата в html код product-item
	function loadProductsOfJson(data, checkedOptionValues) {
		const productsItems = document.querySelector('.products__items');
		//обновляем товары
		productsItems.textContent = '';
		// создаём массив из всех товаров из Json ответа
		let arrOfJson = data.products;
		// создаём масив брендов и добавляем туда item которые пройдут проверку совпадения по brand 
		let arrBrands = [];
		if (checkedOptionValues.brand !== 'Brand') {
			arrOfJson.forEach(function (item) {
				if (item.brand === checkedOptionValues.brand) {
					arrBrands.push(item);
					return arrBrands;
				}


			})
		} else {
			//если стандартное значение не меняется массив товаров прокидывается дальше в следующю проверку
			arrBrands = arrOfJson;
		}
		if (arrBrands.length == 0) {
			console.log('pizdec');
			// checkedOptionValue = 'Brand';
			// return
		}

		// создаём масив arrPrices и добавляем туда item которые пройдут проверку совпадения по price из переданых items с прошлой проверки
		let arrPrice = [];
		if (checkedOptionValues.price !== 'Price') {
			let priceStr = checkedOptionValues.price;
			let lowNumber;
			let topNumber;
			if (priceStr === '$100 or less') {
				lowNumber = 1;
				topNumber = 100;
			} else if (priceStr === 'More than $7500') {
				lowNumber = 1000;
				topNumber = Infinity;
			} else if (priceStr.includes('-', 0)) {
				let strArr = priceStr.split('-');
				lowNumber = strArr[0].replace(/[\s$]/g, "");
				topNumber = strArr[1].replace(/[\s$]/g, "");
			}
			arrBrands.forEach(function (item, index) {
				if (topNumber > item.price && item.price > lowNumber) {
					arrPrice.push(item)
					return arrPrice;
				}
			});
		} else {
			arrPrice = arrBrands;
		}

		// создаём масив arrAudience и добавляем туда item которые пройдут проверку совпадения по audience из переданых items с прошлой проверки
		let arrAudience = [];
		if (checkedOptionValues.audience !== 'Audience') {
			arrPrice.forEach(function (item) {
				if (item.audience === checkedOptionValues.audience) {
					arrAudience.push(item);
					return arrAudience;
				}
			})
		} else {
			arrAudience = arrPrice;
		}

		// создаём масив arrCollections и добавляем туда item которые пройдут проверку совпадения по collection из переданых items с прошлой проверки
		let arrCollections = [];
		if (checkedOptionValues.collection !== 'Collection') {
			console.log('ok');
			arrAudience.forEach(function (item) {
				if (item.collection === checkedOptionValues.collection) {
					arrCollections.push(item);
					return arrCollections;
				}
			})
		} else {
			arrCollections = arrAudience;
		}

		// создаём масив arrSeasons и добавляем туда item которые пройдут проверку совпадения по season из переданых items с прошлой проверки
		let arrSeasons = []
		if (checkedOptionValues.season !== 'Season') {
			arrCollections.forEach(function (item) {
				if (item.season === checkedOptionValues.season) {
					arrSeasons.push(item);
					return arrSeasons;
				}
			})
		} else {
			arrSeasons = arrCollections;
		}

		// создаём масив arrEvents и добавляем туда item которые пройдут проверку совпадения по event из переданых items с прошлой проверки
		let arrEvents = [];
		if (checkedOptionValues.event !== 'Event') {
			arrSeasons.forEach(function (item) {
				if (item.event === checkedOptionValues.event) {
					arrEvents.push(item);
					return arrEvents;
				}
			})
		} else {
			arrEvents = arrSeasons;
		}

		let arrItemsOfValues = arrEvents;
		arrItemsOfValues.forEach(item => {
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productBrand = item.brand;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productShareUrl = item.shareUrl;
			const productLikeUrl = item.likeUrl;
			const productLabels = item.labels;


			let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
			<a href="${productUrl}" class="item-product__image -ibg">
				<img src="img/products/${productImage}" alt="${productTitle}">
			</a>
		`;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
			<div class="item-product__content">
				<h3 class="item-product__title">${productTitle}</h3>
				<div class="item-product__brand">${productBrand}</div>
			</div>
		`;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">${productPrice}$</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">${productOldPrice}$</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
			<div class="item-product__actions actions-product">
				<div class="actions-product__body">
					<a href="" class="actions-product__button button button_white">Buy</a>
					<a href="${productShareUrl}" class="actions-product__link icon-3">Share</a>
					<a href="${productLikeUrl}" class="actions-product__link icon-3">Like</a>
				</div>
			</div>
		`;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

			productsItems.insertAdjacentHTML('beforeend', productTemplate);
			let productsQuanityArr = Object.values(productsItems.children);


			if (productTemplate == '') {
				console.log('short list');
				buttonShowMore.classList.add('_hidden')
			}
			response(productsQuanityArr)


			// return productsQuanityArr;
		});

		function response(productsQuanityArr) {
			productsQuanityArr.forEach(function (item, index) {
				item.classList.add('_hidden')
				if (index < 6) {
					item.classList.remove('_hidden')
				} else if (index > 6) {
					buttonShowMore.classList.remove('_hidden')
				}
				openCatalog(productsQuanityArr, index);
			});
		}
		function openCatalog(productsQuanityArr, index) {
			buttonShowMore.addEventListener('click', () => {
				for (let i = 6; i < productsQuanityArr.length; i++)
					// index+=6;
					productsQuanityArr.forEach(function (item, index) {
						item.classList.remove('_hidden');
						buttonShowMore.classList.add('_hidden');
					})
			})
		};
	}
}
