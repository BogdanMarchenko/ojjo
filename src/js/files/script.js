// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

'use strict'



window.onload = function () {
	document.addEventListener("click", documentActions);

	// Actions (делегирование события cLick)
	function documentActions(e) {
		const targetElement = e.target;

		if (targetElement.classList.contains('products__more')) {
			getProductsShowMore(targetElement);
			e.preventDefault();
		}

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

		// создаём масив arrPrices и добавляем туда item которые пройдут проверку совпадения по price из переданых items с прошлой проверки
		let arrPrice = [];
		if (checkedOptionValues.price !== 'Price') {
			let priceStr = checkedOptionValues.price;
			let strArr = priceStr.split('-');
			let lowNumber = strArr[0].replace(/[\s$]/g, "");
			let topNumber = strArr[1].replace(/[\s$]/g, "");
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
		});
	}




	// • Load More Products
	async function getProductsShowMore(button) {
		if (!button.classList.contains('_hold')) {
			button.classList.add('_hold');
			//по класу холд будет происходить процес fetch запроса и ми будем блокировать повторное виполнение запроса пока не виполниться старий запрос
			const file = "files/json/products.json";
			let response = await fetch(file, {
				method: "GET"
			});
			if (response.ok) {
				let result = await response.json();
				loadProductsShowMore(result);
				button.classList.remove('_hold');
				//удаляем кнопку потому что тут фейковий запрос в реальном проекте в переменной file будет храниться реальний адрес некого сервера и тогда удалять кнопку не надо
				// button.remove();
			} else {
				alert("Ошибка");
			}
		}
	}
	let count = 12;
	// функция обработки json формата в html код product-item по кнопке Show more
	function loadProductsShowMore(data) {
		const productsItems = document.querySelector('.products__items');
		productsItems.textContent = '';

		let productsQuanity = document.querySelectorAll('.products__item');
		console.log(productsQuanity);

		for (let i = 0; i < data.products.length; i++) {
			let item = data.products[i];

			if (i === count) {
				count += 6;
				if (count > data.products.length) {
					count = data.products.length;
				}
				return;
			}

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

		}

		// data.products.forEach(function (item, index) {
		// 	console.log(count);
		// 	console.log(index);
		// 	if (index === count) {
		// 		// count *= 2;
		// 		return;
		// 	} else {
		// 		console.log('ok');
		// 	}
		// 	const productId = item.id;
		// 	const productUrl = item.url;
		// 	const productImage = item.image;
		// 	const productTitle = item.title;
		// 	const productBrand = item.brand;
		// 	const productPrice = item.price;
		// 	const productOldPrice = item.priceOld;
		// 	const productShareUrl = item.shareUrl;
		// 	const productLikeUrl = item.likeUrl;
		// 	const productLabels = item.labels;

		// 	let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
		// 	let productTemplateEnd = `</article>`;

		// 	let productTemplateLabels = '';
		// 	if (productLabels) {
		// 		let productTemplateLabelsStart = `<div class="item-product__labels">`;
		// 		let productTemplateLabelsEnd = `</div>`;
		// 		let productTemplateLabelsContent = '';

		// 		productLabels.forEach(labelItem => {
		// 			productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
		// 		});

		// 		productTemplateLabels += productTemplateLabelsStart;
		// 		productTemplateLabels += productTemplateLabelsContent;
		// 		productTemplateLabels += productTemplateLabelsEnd;
		// 	}

		// 	let productTemplateImage = `
		// 	<a href="${productUrl}" class="item-product__image -ibg">
		// 		<img src="img/products/${productImage}" alt="${productTitle}">
		// 	</a>
		// `;

		// 	let productTemplateBodyStart = `<div class="item-product__body">`;
		// 	let productTemplateBodyEnd = `</div>`;

		// 	let productTemplateContent = `
		// 	<div class="item-product__content">
		// 		<h3 class="item-product__title">${productTitle}</h3>
		// 		<div class="item-product__brand">${productBrand}</div>
		// 	</div>
		// `;

		// 	let productTemplatePrices = '';
		// 	let productTemplatePricesStart = `<div class="item-product__prices">`;
		// 	let productTemplatePricesCurrent = `<div class="item-product__price">${productPrice}$</div>`;
		// 	let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">${productOldPrice}$</div>`;
		// 	let productTemplatePricesEnd = `</div>`;

		// 	productTemplatePrices = productTemplatePricesStart;
		// 	productTemplatePrices += productTemplatePricesCurrent;
		// 	if (productOldPrice) {
		// 		productTemplatePrices += productTemplatePricesOld;
		// 	}
		// 	productTemplatePrices += productTemplatePricesEnd;

		// 	let productTemplateActions = `
		// 	<div class="item-product__actions actions-product">
		// 		<div class="actions-product__body">
		// 			<a href="" class="actions-product__button button button_white">Buy</a>
		// 			<a href="${productShareUrl}" class="actions-product__link icon-3">Share</a>
		// 			<a href="${productLikeUrl}" class="actions-product__link icon-3">Like</a>
		// 		</div>
		// 	</div>
		// `;

		// 	let productTemplateBody = '';
		// 	productTemplateBody += productTemplateBodyStart;
		// 	productTemplateBody += productTemplateContent;
		// 	productTemplateBody += productTemplatePrices;
		// 	productTemplateBody += productTemplateActions;
		// 	productTemplateBody += productTemplateBodyEnd;

		// 	let productTemplate = '';
		// 	productTemplate += productTemplateStart;
		// 	productTemplate += productTemplateLabels;
		// 	productTemplate += productTemplateImage;
		// 	productTemplate += productTemplateBody;
		// 	productTemplate += productTemplateEnd;

		// 	productsItems.insertAdjacentHTML('beforeend', productTemplate);

		// });
	}
}

