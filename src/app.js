import { fearCards } from "./data";
import { GameState } from "./game_state";
import { Deck, preventSleep } from "./utils";
import { Component, mount, useState, xml } from "@odoo/owl";

class Root extends Component {
  static template = xml`
    <div class="p-1">
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Turn <t t-esc="game.turn"/></span>
        <div class="d-flex">
          <div class="button" t-on-click="() => this.game.nextStep()">Next Step</div>
        </div>
      </div>
      <div t-if="game.turn">
        <t t-esc="game.currentStep()"/>
      </div>
      <hr/>
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Fear</span>
        <div class="d-flex">
          <div class="button" t-att-class="{'disabled': game.revealedFearCards}" t-on-click="() => this.game.increaseFear()">Increase</div>
          <div class="button" t-att-class="{'disabled': game.earnedFearCards.length === 0 || this.game.revealedFearCards === this.game.earnedFearCards.length}" t-on-click="() => this.game.showFearCard()">Show</div>
          <div class="button" t-att-class="{'disabled': game.revealedFearCards === 0 || game.revealedFearCards !== game.earnedFearCards.length}" t-on-click="() => this.game.discardFearCard()">Discard</div>
        </div>
      </div>
      <div>Terror Level: <t t-esc="game.terrorLevel"/></div>
      <div>Fear Counter: <t t-esc="game.fearCounter"/>/4</div>
      <div>Remaining Fear Cards: <t t-esc="game.fearDeck.currentSize"/></div>
      <div>Earned Fear Cards: <t t-esc="game.earnedFearCards.length"/></div>
      <t t-if="game.revealedFearCards">
        <t t-foreach="game.earnedFearCards.slice(0,game.revealedFearCards)" t-as="card" t-key="card_index">
          <div class="m-2 border-gray p-1">
            <div class="text-bold"><t t-esc="card.title"/></div>
            <div class="text-italic"><t t-esc="getCardEffect(card)"/></div>
          </div>
        </t>
      </t>
      <hr/>
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Blight</span>
        <div class="d-flex">
          <div class="button" t-on-click="() => this.game.addBlight()">Add</div>
          <div class="button" t-att-class="{'disabled': game.blightCounter === 0}" t-on-click="() => this.game.removeBlight()">Remove</div>
        </div>
      </div>
      <t t-if="game.isBlightCardFlipped">
        <div>Blighted Island</div>
        <div class="m-2 border-gray p-1">
          <div class="text-bold"><t t-esc="game.blightCard.title"/></div>
          <div class="text-italic"><t t-esc="game.blightCard.description"/></div>
        </div>
        <div>Blight Counter: <t t-esc="game.blightCounter"/>/<t t-esc="game.blightCard.blightCount"/></div>
      </t>
      <t t-else="">
        <div>Healthy Island</div>
        <div>Blight Counter: <t t-esc="game.blightCounter"/>/3</div>
      </t>
      <hr/>
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Invaders</span>
        <div class="d-flex">
          <div class="button" t-att-class="{'disabled': !game.invaderDeck.currentSize || game.exploreTarget !== '(none)'}" t-on-click="() => this.game.explore()">Explore</div>
          <div class="button" t-att-class="{'disabled': game.exploreTarget === '(none)'}" t-on-click="() => this.game.advanceInvaders()">Advance</div>
        </div>
      </div>
      <div>Invader deck: <t t-esc="game.invaderDeck.currentSize"/> cards remaining</div>
      <div class="d-flex">
      <div class="m-1 border-gray p-1 flex-1">
          <div class="text-bold">Ravage</div>
          <div class="text-italic"><t t-esc="game.ravageTarget"/></div>
        </div>
        <div class="m-1 border-gray p-1 flex-1">
          <div class="text-bold">Build</div>
          <div class="text-italic"><t t-esc="game.buildTarget"/></div>
        </div>
        <div class="m-1 border-gray p-1 flex-1">
          <div class="text-bold">Explore</div>
          <div class="text-italic"><t t-esc="game.exploreTarget"/></div>
        </div>
      </div>
    </div>`;

  setup() {
    this.game = useState(new GameState());
    preventSleep();

    // debug
    window.game = this.game;
  }

  getCardEffect(card) {
    switch (this.game.terrorLevel) {
      case 1:
        return card.effect1;
      case 2:
        return card.effect2;
      case 3:
        return card.effect3;
    }
  }
}

mount(Root, document.body);

console.log(new Deck(fearCards).shuffle());
