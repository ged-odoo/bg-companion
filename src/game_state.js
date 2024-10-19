import {
  blightCards,
  fearCards,
  invaderCards1,
  invaderCards2,
  invaderCards3,
} from "./data";
import { Deck } from "./utils";

function makeInvaderDeck() {
  const lvl1Deck = new Deck(invaderCards1).shuffle();
  const lvl2Deck = new Deck(invaderCards2).shuffle();
  const lvl3Deck = new Deck(invaderCards3).shuffle();
  return Deck.join(lvl1Deck.slice(3), lvl2Deck.slice(4), lvl3Deck.slice(5));
}

export const PHASES = [
  "growth",
  "gain_energy",
  "choose_powers",
  "fast_powers",
  "blighted_island",
  "event",
  "fear",
  "ravage",
  "build",
  "explore",
  "slow_powers",
  "time_passes",
];

export const PHASE_MAP = {
  growth: "Spirit Phase: Growth",
  gain_energy: "Spirit Phase: Gain Energy",
  choose_powers: "Spirit Phase: Choose and Pay for Powers",
  fast_powers: "Fast Power Phase",
  blighted_island: "Invader Phase: Blighted Island",
  event: "Event Phase",
  fear: "Invader Phase: Fear",
  ravage: "Invader Phase: Ravage",
  build: "Invader Phase: Build",
  explore: "Invader Phase: Explore",
  slow_powers: "Slow Power Phase",
  time_passes: "End of Turn: Time passes",
};

export class GameState {
  constructor() {
    this.players = 1;
    this.isStarted = false;
    this.invaderDeck = makeInvaderDeck();
    this.fearDeck = new Deck(fearCards).shuffle().slice(9);
    this.earnedFearCards = [];
    this.revealedFearCards = 0; // nbr of revealed earned fear cards
    this.blightCardDeck = new Deck(blightCards).shuffle();
    this.blightCard = this.blightCardDeck.draw();
    this.terrorLevel = 1;
    this.fearCounter = 0;
    this.blightCounter = 0;
    this.isBlightCardFlipped = false;
    this.ravageTarget = "(none)";
    this.ravageBg = "white,white";
    this.buildTarget = "(none)";
    this.buildBg = "white,white";
    this.exploreTarget = "(none)";
    this.exploreBg = "white,white";
    this.turn = 1;
    this.step = 0;

    //debug
    window.gamestate = this;
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

  get currentPhase() {
    return PHASES[this.step];
  }

  nextPhase() {
    if (this.currentPhase === "fear") {
      this.discardFearCard();
    }
    this.step++;
    if (this.step === PHASES.length) {
      this.turn++;
      this.step = 0;
    }
    const currentPhase = this.currentPhase;
    if (currentPhase === "explore") {
      this.explore();
    }
    if (currentPhase === "slow_powers") {
      this.advanceInvaders();
    }
    if (currentPhase === "blighted_island" && !this.isBlightCardFlipped) {
      this.nextPhase();
      return;
    }
    if (currentPhase === "fear" && !this.earnedFearCards.length) {
      this.nextPhase();
      return;
    }
    if (currentPhase === "ravage" && this.ravageTarget === "(none)") {
      this.nextPhase();
      return;
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
    } else if (
      this.blightCounter ===
      this.players * this.blightCard.blightCount
    ) {
      if (this.blightCard.staysHealthy) {
        this.blightCounter = 0;
        this.blightCard = this.blightCardDeck.draw();
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
    this.exploreBg = card.background;
    this.save();
  }

  advanceInvaders() {
    this.ravageTarget = this.buildTarget;
    this.ravageBg = this.buildBg;
    this.buildTarget = this.exploreTarget;
    this.buildBg = this.exploreBg;
    this.exploreTarget = "(none)";
    this.exploreBg = "white,white";
    this.save();
  }
}
