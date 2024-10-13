import { fearCards } from "./data";
import { GameState, PHASE_MAP, PHASES } from "./game_state";
import { Deck, preventSleep } from "./utils";
import { Component, mount, onWillUnmount, useState, xml } from "@odoo/owl";

class Card extends Component {
  static template = xml`
      <div class="m-1 p-1 flex-1 border-gray border-radius-4 bg-white"  t-att-class="props.class">
        <div class="text-bold"><t t-esc="props.title"/></div>
        <div class="text-italic"><t t-slot="default"/></div>
      </div>
  `;
  static props = ["class?"];
}

class PhaseCard extends Component {
  static template = xml`
    <div class="py-2 px-1 bg-white"
      t-att-style=" (active ? 'border: 1px solid black;background-color:#ffdcab;' : 'border:1px solid #ccc;')">
      <div class="d-flex space-between align-center mb-1">
        <span  class="text-bold" t-att-class="{'text-dark-gray': !active}">
          <t t-esc="text"/>
        </span>
        <span t-if="props.slots and props.slots.info">
          <t t-slot="info"/>
        </span>
      </div>
      <t t-slot="default"/>
    </div>`;
  static props = ["phase", "game", "slots?"];

  get text() {
    return PHASE_MAP[this.props.phase];
  }

  get active() {
    return this.props.phase === this.props.game.currentPhase;
  }
}

class Button extends Component {
  static template = xml`
    <div class="button" t-att-class="currentClass" t-on-click="onClick">
      <t t-slot="default"/>
    </div>`;
  static props = ["onClick", "class", "disabled"];

  setup() {
    this.state = useState({ isDisabled: false });
    this.interval = null;
    onWillUnmount(() => clearInterval(this.interval));
  }

  onClick() {
    this.props.onClick();
    this.state.isDisabled = true;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.state.isDisabled = false;
      this.interval = null;
    }, 400);
  }

  get currentClass() {
    let result = this.props.class || "";
    if (this.state.isDisabled || this.props.disabled) {
      result += " disabled";
    }
    return result;
  }
}

class Root extends Component {
  static template = xml`
    <!-- NAVBAR -->
    <div class="bg-primary text-white d-flex align-center space-between" style="height:45px;">
      <t t-if="game.isStarted">
        <span class="m-1">Turn <t t-esc="game.turn"/></span>
        <span class="m-1">Invader deck: <t t-esc="game.invaderDeck.currentSize"/>/12 cards</span>
      </t>
      <t t-else="">
        <span class="m-1">Setup</span>
      </t>
    </div>
    <div class="d-flex flex-column m-2 p-2" t-if="!game.isStarted">
      <!-- <div>
        <span>Number of players: </span>
        <select t-model.number="game.players">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div> -->
      <Button class="'m-2'" onClick="() => this.start(1)">Start (1 player)</Button>
      <Button class="'m-2'" onClick="() => this.start(2)">Start (2 players)</Button>
      <Button class="'m-2'" t-if="canRestore" onClick.bind="restore">Restore from Local Storage</Button>
    </div>
    <div class="flex-grow d-flex flex-column" t-if="game.isStarted">
      <div class="d-flex ">
        <Card title="'Ravage'" class="'pb-2'">
          <t t-esc="game.ravageTarget"/>
        </Card>
        <Card title="'Build'" class="'pb-2'">
          <t t-esc="game.buildTarget"/>
        </Card>
        <Card title="'Explore'"  class="'pb-2'">
          <t t-esc="game.exploreTarget"/>
        </Card>
      </div>
      <div class="d-flex">
        <div class="button" t-on-click="() => this.game.increaseFear()">Add Fear</div>
        <div class="button" t-on-click="() => this.game.addBlight()">Add Blight</div>
        <div class="button" t-att-class="{disabled: game.blightCounter === 0}" t-on-click="() => this.game.removeBlight()">Remove Blight</div>
        <div class="button" t-att-class="{disabled: !game.earnedFearCards.length || this.game.revealedFearCards === game.earnedFearCards.length}" t-on-click="() => this.game.showFearCard()">Reveal Fear</div>
        <div class="button" t-on-click="() => this.game.nextPhase()">Next Phase</div>
      </div>
      <PhaseCard phase="'growth'" game="game"/>
      <PhaseCard phase="'gain_energy'" game="game"/>
      <PhaseCard phase="'choose_powers'" game="game"/>
      <PhaseCard phase="'fast_powers'" game="game"/>
      <PhaseCard phase="'blighted_island'" game="game">
        <t t-set-slot="info">
          <span>
            <t t-if="game.isBlightCardFlipped">
              Blighted Island. Count: <span class="text-bold text-larger"><t t-esc="game.blightCounter"/>/<t t-esc="game.blightCard.blightCount*game.players"/></span>
            </t>
            <t t-else="">
              Healthy Island. Count: <span class="text-bold text-larger"><t t-esc="game.blightCounter"/>/<t t-esc="2*game.players + 1"/></span>
            </t>
          </span>
        </t>
        <t t-if="game.isBlightCardFlipped">
          <Card title="game.blightCard.title">
            <t t-esc="game.blightCard.description"/>
          </Card>
        </t>
      </PhaseCard>
      <PhaseCard phase="'fear'" game="game">
        <t t-set-slot="info">
          <span class="d-flex">Terror Level: <span class="text-bold text-larger"><t t-esc="game.terrorLevel"/></span></span>
        </t>
        <div class="d-flex space-between mt-1">
          <span>Remaining Fear Cards: <t t-esc="game.fearDeck.currentSize"/></span>
          <span>Fear counter: <span class="text-bold text-larger"><t t-esc="game.fearCounter"/>/<t t-esc="4*game.players"/></span></span>
        </div>
        <t t-foreach="game.earnedFearCards" t-as="card" t-key="card_index">
          <t t-set="isRevealed" t-value="card_index lt game.revealedFearCards"/>
          <Card title="isRevealed ? card.title : 'Fear Card'">
            <span t-att-class="{'opacity-0': !isRevealed}"><t t-esc="getCardEffect(card)"/></span>
          </Card>
        </t>
      </PhaseCard>
      <PhaseCard phase="'ravage'" game="game"/>
      <PhaseCard phase="'build'" game="game"/>
      <PhaseCard phase="'explore'" game="game"/>
      <PhaseCard phase="'slow_powers'" game="game"/>
      <PhaseCard phase="'time_passes'" game="game"/>
    </div>`;
  static components = { Button, Card, PhaseCard };

  setup() {
    this.game = useState(new GameState());
    preventSleep();

    this.canRestore = window.localStorage.getItem("bg_state");
    // debug
    window.game = this.game;
  }

  start(n) {
    this.game.players = n;
    this.game.start();
  }

  restore() {
    this.game.restore();
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
