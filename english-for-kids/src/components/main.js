/* eslint-disable no-unused-vars */
import Route from '../js/route';
import Router from '../js/router';

import ButtonSwitchMode from './button-switch-mode/button-switch-mode';
import BurgerMenu from './burger-menu/burger-menu';
import CategoriesContainer from './categories-container/categories-container';
import CardsContainer from './cards-container/cards-container';

import GameMod from '../js/gamemod';

const switchMode = new ButtonSwitchMode();
const burgerMenu = new BurgerMenu();
burgerMenu.initial();

const gamemod = new GameMod();
const router = new Router([
  new Route('/', () => {
    gamemod.setDefault(true);

    const categories = new CategoriesContainer();
    categories.initial();
  }, true),
  new Route('/categories/{id}', () => {
    gamemod.setDefault(false);

    burgerMenu.toggleActiveTab();
    const cards = new CardsContainer();
    cards.initial();
    gamemod.cardsContainer = cards;
  }),
]);

gamemod.initial();
