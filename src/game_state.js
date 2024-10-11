import {
  blightCards,
  fearCards,
  invaderCards1,
  invaderCards2,
  invaderCards3,
  steps,
} from "./data";
import { Deck } from "./utils";

function makeInvaderDeck() {
  const lvl1Deck = new Deck(invaderCards1).shuffle();
  const lvl2Deck = new Deck(invaderCards2).shuffle();
  const lvl3Deck = new Deck(invaderCards3).shuffle();
  return Deck.join(lvl1Deck.slice(3), lvl2Deck.slice(4), lvl3Deck.slice(5));
}

export class GameState {
  constructor() {
    this.players = 1;
    this.isStarted = false;
    this.invaderDeck = makeInvaderDeck();
    this.fearDeck = new Deck(fearCards).shuffle().slice(9);
    this.earnedFearCards = [];
    this.revealedFearCards = 0; // nbr of revealed earned fear cards
    this.blightCard = new Deck(blightCards).shuffle().cards[0];
    this.terrorLevel = 1;
    this.fearCounter = 0;
    this.blightCounter = 0;
    this.isBlightCardFlipped = false;
    this.ravageTarget = "(none)";
    this.buildTarget = "(none)";
    this.exploreTarget = "(none)";
    this.turn = 1;
    this.step = 0;
  }

  start() {
    this.explore();
    this.advanceInvaders();
    this.isStarted = true;
  }
  // ---------------------------------------------------------------------------
  // Save/Restore
  // ---------------------------------------------------------------------------

  save() {
    const state = JSON.stringify(this);
    localStorage.setItem("bg_state", state);
  }

  restore() {
    const dataStr = localStorage.getItem("bg_state");
    if (!dataStr) {
      return;
    }
    const data = JSON.parse(dataStr);
    Object.assign(this, data);
    this.invaderDeck = new Deck(this.invaderDeck.cards);
    this.fearDeck = new Deck(this.fearDeck.cards);
  }

  // ---------------------------------------------------------------------------
  // Turn/Step Tracker
  // ---------------------------------------------------------------------------

  currentStep() {
    return steps[this.step];
  }

  nextStep() {
    if (this.turn === 0) {
      this.turn = 1;
    } else {
      this.step++;
      if (this.step === steps.length) {
        this.turn++;
        this.step = 0;
      }
    }
    this.save();
  }
  // ---------------------------------------------------------------------------
  // Fear/Terror
  // ---------------------------------------------------------------------------

  increaseFear() {
    this.fearCounter++;
    if (this.fearCounter === 4 * this.players) {
      this.fearCounter = 0;
      this.drawFearCard();
    }
    this.save();
  }

  drawFearCard() {
    const card = this.fearDeck.draw();
    this.earnedFearCards.push(card);
    if (this.fearDeck.currentSize % 3 === 0) {
      this.terrorLevel++;
    }
    this.save();
  }

  showFearCard() {
    this.revealedFearCards++;
    this.save();
  }

  discardFearCard() {
    this.earnedFearCards = [];
    this.revealedFearCards = 0;
    this.save();
  }

  // ---------------------------------------------------------------------------
  // Blight stuff
  // ---------------------------------------------------------------------------

  addBlight() {
    this.blightCounter++;
    if (!this.isBlightCardFlipped) {
      if (this.blightCounter === this.players * 2 + 1) {
        this.isBlightCardFlipped = true;
        this.blightCounter = 0;
      }
    }
    this.save();
  }

  removeBlight() {
    this.blightCounter--;
    this.save();
  }

  // ---------------------------------------------------------------------------
  // Invaders
  // ---------------------------------------------------------------------------

  explore() {
    const card = this.invaderDeck.draw();
    this.exploreTarget = card.description;
    this.save();
  }

  advanceInvaders() {
    this.ravageTarget = this.buildTarget;
    this.buildTarget = this.exploreTarget;
    this.exploreTarget = "(none)";
    this.save();
  }
}
