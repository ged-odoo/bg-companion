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
      t-att-style="active ? 'border: 1px solid black;background-color:#ffdcab;' : 'border:1px solid #ccc;'">
      <div class="d-flex space-between align-center">
        <span  class="text-bold" t-att-class="{'text-dark-gray': !active}">
          <t t-esc="text"/>
        </span>
        <t t-if="active">
          <span class="button" style="margin:0;" t-on-click="() => props.game.nextPhase()">
            Complete
          </span>
        </t>
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
      <div class="d-flex py-1 border-bottom-gray" style="border-bottom:1px solid black;">
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
      <PhaseCard phase="'growth'" game="game"/>
      <PhaseCard phase="'gain_energy'" game="game"/>
      <PhaseCard phase="'choose_powers'" game="game"/>
      <PhaseCard phase="'fast_powers'" game="game"/>
      <PhaseCard phase="'blighted_island'" game="game">
        <div class="d-flex align-center mb-1">
          <span class="flex-grow d-flex align-center">
            <t t-if="game.isBlightCardFlipped">
              Blighted Island (counter: <t t-esc="game.blightCounter"/>/<t t-esc="game.blightCard.blightCount*game.players"/>)
            </t>
            <t t-else="">
              Healthy Island (counter: <t t-esc="game.blightCounter"/>/<t t-esc="2*game.players + 1"/>)
            </t>
            <Button class="my-2" onClick="() => game.removeBlight()" disabled="game.blightCounter === 0">Remove</Button>
            <Button onClick="() => game.addBlight()">Add</Button>
          </span>
        </div>
        <t t-if="game.isBlightCardFlipped">
          <Card title="game.blightCard.title">
            <t t-esc="game.blightCard.description"/>
          </Card>
        </t>
      </PhaseCard>
      <PhaseCard phase="'fear'" game="game">
        <div class="d-flex align-center">
          <span>Terror Level: <t t-esc="game.terrorLevel"/> (fear counter: <t t-esc="game.fearCounter"/>/<t t-esc="4*game.players"/>)</span>
          <Button  onClick="() => this.game.increaseFear()">
            Increase
          </Button>
        </div>
      <div class="d-flex align-center">
        <span>Remaining Fear Cards: <t t-esc="game.fearDeck.currentSize"/></span>
        <Button t-if="game.earnedFearCards.length and this.game.revealedFearCards !== game.earnedFearCards.length" onClick="() => game.showFearCard()">
            Reveal
        </Button>
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
      <!-- TURN TRACKER -->
      <!-- <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Turn <t t-esc="game.turn"/></span>
        <div class="d-flex">
          <Button class="'p-2'" onClick="() => this.game.nextStep()">Next Step</Button>
        </div>
      </div>
      <div >
        <span><t t-if="game.turn" t-esc="game.currentStep()"/></span>
      </div>
      <hr/> -->
      <!-- INVADER STUFF -->
      <!-- <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Invaders</span>
        <div class="d-flex">
          <Button onClick="() => this.game.explore()" disabled="!game.invaderDeck.currentSize || game.exploreTarget !== '(none)'">
            Explore
          </Button>
          <Button onClick="() => this.game.advanceInvaders()" disabled="game.exploreTarget === '(none)'">
            Advance
          </Button>
        </div>
      </div> -->
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
