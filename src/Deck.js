import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function CardDeck() {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDeckShuffling, setIsDeckShuffling] = useState(false);

  useEffect(function fetchDeckFromAPI() {
    async function fetchData() {
      const response = await axios.get(`${BASE_URL}/new/shuffle/`);
      setCurrentDeck(response.data);
    }
    fetchData();
  }, []);

  async function drawCard() {
    try {
      const drawResponse = await axios.get(`${BASE_URL}/${currentDeck.deck_id}/draw/`);

      if (drawResponse.data.remaining === 0) throw new Error("Deck exhausted! Reshuffle to continue.");

      const card = drawResponse.data.cards[0];

      setDrawnCards(cards => [
        ...cards,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (error) {
      alert(error);
    }
  }

  async function shuffleDeck() {
    setIsDeckShuffling(true);
    try {
      await axios.get(`${BASE_URL}/${currentDeck.deck_id}/shuffle/`);
      setDrawnCards([]);
    } catch (error) {
      alert(error);
    } finally {
      setIsDeckShuffling(false);
    }
  }

  function renderDrawButton() {
    if (!currentDeck) return null;

    return (
      <button
        className="Deck-btns"
        onClick={drawCard}
        disabled={isDeckShuffling}>
        DRAW
      </button>
    );
  }

  function renderShuffleButton() {
    if (!currentDeck) return null;
    return (
      <button
        className="Deck-btns"
        onClick={shuffleDeck}
        disabled={isDeckShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">
      {renderDrawButton()}
      {renderShuffleButton()}

      <div className="Deck-area">{
        drawnCards.map(card => (
          <Card key={card.id} name={card.name} image={card.image} />
        ))}
      </div>
    </main>
  );
}

export default CardDeck;