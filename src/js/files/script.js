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
