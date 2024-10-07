export class Deck {
  static join(...decks) {
    const cards = decks.map((d) => d.cards).flat(1);
    return new Deck(cards);
  }

  constructor(cards = []) {
    this.cards = cards;
    this.discardPile = [];
  }

  /**
   * Shuffle the cards in place
   * @returns { Deck }
   */
  shuffle() {
    const cards = this.cards;
    for (let i = cards.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return this;
  }

  /**
   * Returns a new deck with only the first n cards
   * @returns { Deck }
   */
  slice(n) {
    const cards = this.cards.slice(0, n);
    return new Deck(cards);
  }

  get currentSize() {
    return this.cards.length;
  }

  draw() {
    const card = this.cards.shift();
    this.discardPile.push(card);
    return card;
  }
}
