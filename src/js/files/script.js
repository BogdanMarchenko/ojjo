// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

'use strict'

let menuList = document.querySelector('.menu__list');

function toToggleClass(item) {

	item.classList.add("flip-horizontal-top");
	setTimeout(() => {
		item.classList.remove('flip-horizontal-top')
	}, 800);
}
menuList.addEventListener("click", function (e) {
	if (e.target.closest('.menu__link')) {
		toToggleClass(e.target.closest('.menu__link'));
	}
});

window.onload = function () {
	document.addEventListener("click", documentActions);

	// Actions (делегирование события cLick)
	function documentActions(e) {
		const targetElement = e.target;
		// if (window.innerWidth > 768 && isMobile.any()) {
		// 	if (targetElement.classList.contains('menu__arrow')) {
		// 		targetElement.closest('.menu__item').classList.toggle('_hover');
		// 	}
		// 	if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item.hover').length > 0) {
		// 		_removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
		// 	}
		// }
		// if
		// 	(targetElement.classList.contains('.search-form__icon')) {
		// 	document.querySelector('.search-form').classList.toggle('_active');
		// } else if (targetElement.closest('.search__form') && document.querySelector('.search__form._active')) {
		// 	document.querySelector('.search-form').classList.remove('_active');
		// }
		if (targetElement.classList.contains('products__more')) {
			getProducts(targetElement);
			e.preventDefault();
		}
	}

	// • Load More Products
	async function getProducts(button) {
		if (!button.classList.contains('_hold')) {
			button.classList.add('_hold');
			//по класу холд будет происходить процес fetch запроса и ми будем блокировать повторное виполнение запроса пока не виполниться старий запрос
			const file = "files/json/products.json";
			let response = await fetch(file, {
				method: "GET"
			});
			if (response.ok) {
				let result = await response.json();
				loadProducts(result);
				button.classList.remove('_hold');
				//удаляем кнопку потому что тут фейковий запрос в реальном проекте в переменной file будет храниться реальний адрес некого сервера и тогда удалять кнопку не надо
				button.remove();
			} else {
				alert("Ошибка");
			}
		}
	}

	// функция обработки json формата в html код product-item
	function loadProducts(data) {
		const productsItems = document.querySelector('.products__items');

		data.products.forEach(item => {
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
}


