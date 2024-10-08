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
  }

  drawFearCard() {
    const card = this.fearDeck.draw();
    this.earnedFearCards.push(card);
    if (this.fearDeck.currentSize % 3 === 0) {
      this.terrorLevel++;
    }
  }

  showFearCard() {
    this.revealedFearCards++;
  }

  discardFearCard() {
    this.earnedFearCards = [];
    this.revealedFearCards = 0;
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
  }

  removeBlight() {
    this.blightCounter--;
  }

  // ---------------------------------------------------------------------------
  // Invaders
  // ---------------------------------------------------------------------------

  explore() {
    const card = this.invaderDeck.draw();
    this.exploreTarget = card.description;
  }
  advanceInvaders() {
    this.ravageTarget = this.buildTarget;
    this.buildTarget = this.exploreTarget;
    this.exploreTarget = "(none)";
  }
}
