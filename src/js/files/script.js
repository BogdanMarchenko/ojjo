// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

'use strict';

window.onload = function () {


	const productsItems = document.querySelector('.products__items');
	const showMoreButton = document.querySelector('.products__more');
	let startIndex = 0;
	const itemsPerPage = 6;

	// Переменные для фильтров
	let brandFilter = '';
	let priceFilter = '';
	let audienceFilter = '';
	let collectionFilter = '';
	let seasonFilter = '';
	let eventFilter = '';

	// Обработчики событий для фильтров
	document.querySelectorAll('.select__option').forEach(function (filter) {
		filter.addEventListener('click', function (e) {
			const filterValue = e.target.textContent;

			if (e.target.closest('[data-id="1"]')) {
				brandFilter = filterValue;
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
			// не отображается переменные заданые значения
			// return brandFilter, priceFilter, audienceFilter, collectionFilter, seasonFilter, eventFilter;
		});
	});

	// Функция для отображения карточки товара
	function renderProductCard(product) {
		const productId = product.id;
		const productUrl = product.url;
		const productImage = product.image;
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

	// Функция для загрузки данных JSON
	async function loadProducts() {
		const file = 'files/json/products.json';
		await fetch(file)
			.then(response => response.json())
			.then(data => {
				// Применяем фильтры к данным
				const filteredData = data.products.filter(product => {
					// Если brandFilter не определен или соответствует текущему товару, возвращаем true
					//const isBrandFiltered = !brandFilter || product.brand === brandFilter;: Это условие проверяет, соответствует ли текущий продукт заданному фильтру по бренду (brandFilter). Если brandFilter не определен (null, undefined или пустая строка), или если бренд текущего продукта совпадает с brandFilter, то isBrandFiltered будет true, в противном случае - false. Аналогично для других фильтров.
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

					const isBrandFiltered = !brandFilter || product.brand === brandFilter;
					const isPriceFiltered = !priceFilter || topNumber > +product.price && +product.price > lowNumber;
					const isAudienceFiltered = !audienceFilter || product.audience === audienceFilter;
					const isCollectionFiltered = !collectionFilter || product.Collection === collectionFilter;
					const isSeasonFiltered = !seasonFilter || product.season === seasonFilter;
					const isEventFiltered = !eventFilter || product.event === eventFilter;
					return isBrandFiltered && isPriceFiltered && isAudienceFiltered && isCollectionFiltered && isSeasonFiltered && isEventFiltered;
				});

				// Отображаем отфильтрованные данные
				const slicedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
//меняю высоту блока Show more для текста в зависимости от ширины экрана
const showMoreContent = document.querySelector('.services__content');

window.addEventListener('resize', function (event) {
	if (window.innerWidth < 768) {
		showMoreContent.setAttribute("data-showmore-content", "120");
	} else {
		showMoreContent.setAttribute("data-showmore-content", "240");


	}
});




