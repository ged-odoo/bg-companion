import { fearCards } from "./data";
import { GameState } from "./game_state";
import { Deck, preventSleep } from "./utils";
import { Component, mount, onWillUnmount, useState, xml } from "@odoo/owl";

class Card extends Component {
  static template = xml`
        <div class="m-1 border-gray p-1 flex-1 border-radius-4 bg-white" style="box-shadow: 2px 1px 1px #a9a7a7;">
          <div class="text-bold"><t t-esc="props.title"/></div>
          <div class="text-italic"><t t-slot="default"/></div>
        </div>
    `;
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
      <span class="m-1">Spirit Island</span>
    </div>
    <div class="p-1" t-if="!game.isStarted">
      <div>
        <span>Number of players: </span>
        <select t-model.number="game.players">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      <div class="d-flex"><Button onClick.bind="start">Start</Button></div>
      <div class="d-flex" t-if="canRestore"><Button onClick.bind="restore">Restore from Local Storage</Button></div>
    </div>
    <div class="p-1" t-if="game.isStarted">
      <!-- TURN TRACKER -->
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Turn <t t-esc="game.turn"/></span>
        <div class="d-flex">
          <Button class="'p-2'" onClick="() => this.game.nextStep()">Next Step</Button>
        </div>
      </div>
      <div >
        <span><t t-if="game.turn" t-esc="game.currentStep()"/></span>
      </div>
      <hr/>
      <!-- INVADER STUFF -->
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Invaders</span>
        <div class="d-flex">
          <Button onClick="() => this.game.explore()" disabled="!game.invaderDeck.currentSize || game.exploreTarget !== '(none)'">
            Explore
          </Button>
          <Button onClick="() => this.game.advanceInvaders()" disabled="game.exploreTarget === '(none)'">
            Advance
          </Button>
        </div>
      </div>
      <div>Invader deck: <t t-esc="game.invaderDeck.currentSize"/> cards remaining</div>
      <div class="d-flex">
        <Card title="'Ravage'">
          <t t-esc="game.ravageTarget"/>
        </Card>
        <Card title="'Build'">
          <t t-esc="game.buildTarget"/>
        </Card>
        <Card title="'Explore'">
          <t t-esc="game.exploreTarget"/>
        </Card>
      </div>
      <hr/>
      <!-- BLIGHT STUFF -->
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Blight</span>
        <div class="d-flex">
          <Button onClick="() => game.addBlight()">Add</Button>
          <Button onClick="() => game.removeBlight()" disabled="game.blightCounter === 0">Remove</Button>
        </div>
      </div>
      <t t-if="game.isBlightCardFlipped">
        <div>Blighted Island (blight counter: <t t-esc="game.blightCounter"/>/<t t-esc="game.blightCard.blightCount*game.players"/>)</div>
        <Card title="game.blightCard.title">
          <t t-esc="game.blightCard.description"/>
        </Card>
      </t>
      <t t-else="">
        <div>Healthy Island (blight counter: <t t-esc="game.blightCounter"/>/<t t-esc="2*game.players + 1"/>)</div>
      </t>
      <hr/>
      <!-- FEAR STUFF -->
      <div class="d-flex align-center mb-1">
        <span class="flex-grow text-bold text-larger">Fear</span>
        <div class="d-flex">
          <Button disabled="game.revealedFearCards" onClick="() => this.game.increaseFear()">
            Increase
          </Button>
          <Button disabled="game.earnedFearCards.length === 0 || this.game.revealedFearCards === game.earnedFearCards.length" onClick="() => game.showFearCard()">
            Reveal
          </Button>
          <Button disabled="game.revealedFearCards === 0 || game.revealedFearCards !== game.earnedFearCards.length" onClick="() => this.game.discardFearCard()">
            Discard
          </Button>
        </div>
      </div>
      <div>Terror Level: <t t-esc="game.terrorLevel"/></div>
      <div>Fear Counter: <t t-esc="game.fearCounter"/>/<t t-esc="4*game.players"/></div>
      <div>Remaining Fear Cards: <t t-esc="game.fearDeck.currentSize"/></div>
      <t t-foreach="game.earnedFearCards" t-as="card" t-key="card_index">
        <t t-set="isRevealed" t-value="card_index lt game.revealedFearCards"/>
        <Card title="isRevealed ? card.title : 'Fear Card'">
          <span t-att-class="{'opacity-0': !isRevealed}"><t t-esc="getCardEffect(card)"/></span>
        </Card>
      </t>
    </div>`;
  static components = { Button, Card };

  setup() {
    this.game = useState(new GameState());
    preventSleep();

    this.canRestore = window.localStorage.getItem("bg_state");
    // debug
    window.game = this.game;
  }

  start() {
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
