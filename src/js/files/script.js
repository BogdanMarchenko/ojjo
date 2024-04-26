// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

'use strict';
// Код подгрузки products__item в зависимости от выбраных select 
document.addEventListener("DOMContentLoaded", function () {
	// получаем window.location.pathname тоесть проверяем на какой именно странице находимся
	let pathName = window.location.pathname.split('/').pop();
	if (pathName === 'products.html') {
		console.log('ok');
		// ваш код для определенной страницы
		const showMoreButton = document.querySelector('.products__more');
		const productsItems = document.querySelector('.products__items');
		// начальный индекс вывода товаров начинаем с 0, тоесть с первого товара
		let startIndex = 0;
		// число айтемов изначально на странице и по сколько добавлять при клике show more
		const itemsPerPage = 6;

		// Переменные для фильтров
		let brandFilter = '';
		let priceFilter = '';
		let audienceFilter = '';
		let collectionFilter = '';
		let seasonFilter = '';
		let eventFilter = '';

		// Обработчики событий для фильтров
		// навесили обработчик на колекцию опшенов в селектах
		document.querySelectorAll('.select__option').forEach(function (filter) {
			filter.addEventListener('click', function (e) {
				const filterValue = e.target.textContent;

				if (e.target.closest('[data-id="1"]')) {
					brandFilter = filterValue;
					// let item = document.querySelector('[data-id="1"] ._select-pseudo-label');
					// var beforeStyles = window.getComputedStyle(item, '::before');
					// beforeStyles.setProperty('display', 'none');					// item.remove()
					// item.classList.remove('_select-pseudo-label')
					// item.querySelector('[select-pseudo-label]:before')
					// .removeAttribute('data-pseudo-label');

				} else if (e.target.closest('[data-id="2"]')) {
					priceFilter = filterValue;
				} else if (e.target.closest('[data-id="3"]')) {
					audienceFilter = filterValue;
				} else if (e.target.closest('[data-id="4"]')) {
					collectionFilter = filterValue;
				} else if (e.target.closest('[data-id="5"]')) {
					seasonFilter = filterValue;
				} else if (e.target.closest('[data-id="6"]')) {
					eventFilter = filterValue;
				}

				startIndex = 0;
				productsItems.innerHTML = '';

				loadProducts();
			});
		});

		// Функция для отображения карточки товара
		function renderProductCard(product) {
			const productId = product.id;
			const productUrl = product.url;
			const productImage = product.image[0].name;
			const productTitle = product.title;
			const productBrand = product.brand;
			const productPrice = product.price;
			const productOldPrice = product.priceOld;
			const productShareUrl = product.shareUrl;
			const productLikeUrl = product.likeUrl;
			const productLabels = product.labels;

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
					<a href='product.html#${product.id}' class="item-product__brand">${productBrand}</a>
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

		// Функция для загрузки данных JSON
		async function loadProducts() {
			const file = 'files/json/products.json';
			await fetch(file)
				.then(response => response.json())
				.then(data => {
					// Применяем фильтры к данным
					const filteredData = data.products.filter(product => {

						let priceStr = priceFilter;
						let lowNumber;
						let topNumber;
						if (priceFilter === '$100 or less') {
							lowNumber = 1;
							topNumber = 100;
						} else if (priceFilter === 'More than $7500') {
							lowNumber = 75000;
							topNumber = Infinity;
						} else if (priceFilter.includes('-', 0)) {
							let strArr = priceFilter.split('-');
							lowNumber = strArr[0].replace(/[\s$]/g, "");
							topNumber = strArr[1].replace(/[\s$]/g, "");
							+lowNumber;
							+topNumber;
						}

						// Если brandFilter и другие, не определены или соответствуют текущему товару, возвращаем true
						//const isBrandFiltered = !brandFilter || product.brand === brandFilter;: Это условие проверяет, соответствует ли текущий продукт заданному фильтру по бренду (brandFilter). Если brandFilter не определен (null, undefined или пустая строка), или если бренд текущего продукта совпадает с brandFilter, то isBrandFiltered будет true, в противном случае - false. Аналогично для других фильтров.
						const isBrandFiltered = !brandFilter || product.brand === brandFilter || 'All' === brandFilter;
						const isPriceFiltered = !priceFilter || topNumber > +product.price && +product.price > lowNumber || 'All' === priceFilter;
						const isAudienceFiltered = !audienceFilter || product.audience === audienceFilter || 'All' === audienceFilter;
						const isCollectionFiltered = !collectionFilter || product.Collection === collectionFilter || 'All' === collectionFilter;
						const isSeasonFiltered = !seasonFilter || product.season === seasonFilter || 'All' === seasonFilter;
						const isEventFiltered = !eventFilter || product.event === eventFilter || 'All' === eventFilter;
						// вконце возвращаем те элементы которые соответствует заданным фильтрам тоесть все true
						return isBrandFiltered && isPriceFiltered && isAudienceFiltered && isCollectionFiltered && isSeasonFiltered && isEventFiltered;
					});

					// Отображаем отфильтрованные данные
					//itemsPerPage это число сколько задано items изначально на странице и по сколько айтемов добавлять
					const slicedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

					//выводим айтемы на страницу
					slicedData.forEach(product => {
						renderProductCard(product);
					});
					if (slicedData.length < itemsPerPage) {
						showMoreButton.style.display = 'none'; // Скрываем кнопку, если больше нет товаров для загрузки
					}

				})
				.catch(error => console.error('Ошибка загрузки данных:', error));
		}

		// Загрузка данных при загрузке страницы
		loadProducts();

		// Обработчик нажатия на кнопку "Show more"
		showMoreButton.addEventListener('click', function () {
			startIndex += itemsPerPage;
			loadProducts();
		});
	}

	//====================================================================================================


});


//====================================================================================================
//меняю высоту блока Show more для текста в зависимости от ширины экрана
const showMoreContent = document.querySelector('.services__content');
//
let pathName = window.location.pathname.split('/').pop();

if (pathName === `products.html`) {
	window.addEventListener('resize', function (event) {
		if (window.innerWidth < 768) {
			showMoreContent.setAttribute("data-showmore-content", "120");
		} else {
			showMoreContent.setAttribute("data-showmore-content", "240");


		}
	});
}

//====================================================================================================
// Открытие product.html с актуальными данными с сервера или файла products.json
// получаем действующий url на странице и розбиваем его и узнаем на каком hash открыта products.html#1 (например)
const currentUrl = window.location.href;
let ulrHashArr = window.location.href.split('#');
let urlHash = ulrHashArr[1];

// проверка загружено ли окно на product.html что бы не выбрасывало ошибку на других страницах (например обявленная переменна напр объекта на одной странице, не объявлена на другой - будет ошибка null is not a object)
if (pathName === 'product.html') {
	// Здесь ты можешь указать URL сервера, с которого ты хочешь получить информацию о товаре
	const file = 'files/json/products.json';
	const productURL = file;
	// Вызываем функцию для получения информации о товаре при загрузке страницы
	fetchProductInfo(urlHash)

	// Функция для выполнения запроса на сервер и обработки полученных данных
	function fetchProductInfo(urlHash) {
		fetch(productURL)
			.then(response => response.json())
			.then(data => {
				// Применяем фильтры к данным
				// то есть передаём только тот product(ожидаем только один так как urlHash должен быть уникальныи), который проходит проверку true и возвращаем его return
				const filteredData = data.products.filter(product => {
					const isIdFiltered = product.id == urlHash;
					return isIdFiltered;
				});
				// Здесь можешь сделать что-то с полученными данными, например, вывести их на страницу
				// Передаём отфильтрованый product в функцию отображения информации на страницу
				displayProductInfo(filteredData);
			})
			// отлавливаем ошибку
			.catch(error => {
				console.error('Ошибка при получении информации о товаре:', error);
			});
	}

	// Функция для отображения информации о товаре на странице
	function displayProductInfo(filteredData) {
		// так как мы передаём масив отфильтрованых результатов, хотя у него длина 0 то есьь один product, получаем его в константу
		const product = filteredData[0];
		// получаем все нужные свойства products в константы
		const productId = product.id;
		const productType = product.type;
		const productCategory = product.category;
		const productCategoryBrand = product.categoryBrand;
		const productText = product.text;
		const productPrice = product.price;
		const productOldPrice = product.priceOld;
		const productUrl = product.url;
		const productImage = product.image;
		const productTitle = product.title;
		const productBrand = product.brand;
		const productShareUrl = product.shareUrl;
		const productLikeUrl = product.likeUrl;
		const productLabels = product.labels;

		// получаем  нужные элементы для отображения информации о товаре
		const productTitlesItem = document.querySelector('.titles__item_product-link a');
		const productItemTitle = document.querySelector('.description__title');
		const productItemCategory = document.querySelector('.description__category a');
		const productItemBrand = document.querySelector('.description__brand a');
		const productItemPrice = document.querySelector('.description__price');
		const productItemOldPrice = document.querySelector('.description__price_old');
		const productItemGallery = document.querySelector('.description__gallery');
		// на фото получаем коллекцию фото
		const productItemImage = document.querySelectorAll('.product__gallery-item .product__img');

		// отображаем актуальную информацию о товаре полученую с сервера(product.json) путем замены контента
		productTitlesItem.textContent = productTitle + ' ' + productBrand;
		productTitlesItem.href = `product.html#${productId}`;
		productItemTitle.textContent = productTitle + ' ' + productBrand;
		productItemCategory.textContent = productTitle;
		//? link на общие товари по категории
		productItemBrand.textContent = productBrand;
		//?link на общие товари по беренду
		productItemPrice.textContent = `${productPrice}$`;
		productItemOldPrice.textContent = `${productOldPrice}$`;
		//отображаем фото product путем перебора масива тего img и вставки в атрибут src="" нужную строку пути и название фото через свойство name которое отображено в файле products.json 
		productItemImage.forEach(function (item, index) {
			return item.src = '../img/product/' + productImage[index].name;
		})
	}
}