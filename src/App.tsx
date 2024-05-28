import "./App.css";
import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";

export type Card = {
  src: string;
  name: string;
  id: number;
  matched: boolean;
};

const cardImages: { src: string; name: string; matched: boolean }[] = [
  { src: "/img/bath2.jpeg", name: "bath", matched: false },
  { src: "/img/bath2.jpeg", name: "bath", matched: false },
  { src: "/img/burmilla1.jpg", name: "burmilla", matched: false },
  { src: "/img/burmilla1.jpg", name: "burmilla", matched: false },
  { src: "/img/cake2.jpeg", name: "cake", matched: false },
  { src: "/img/cake2.jpeg", name: "cake", matched: false },
  { src: "/img/farm-market1.jpeg", name: "farm-market", matched: false },
  { src: "/img/farm-market1.jpeg", name: "farm-market", matched: false },
  { src: "/img/flowers1.jpeg", name: "flowers", matched: false },
  { src: "/img/flowers1.jpeg", name: "flowers", matched: false },
  { src: "/img/salsa1.jpeg", name: "salsa", matched: false },
  { src: "/img/salsa2.jpeg", name: "salsa", matched: false },
  { src: "/img/yoga1.jpeg", name: "yoga", matched: false },
  { src: "/img/yoga1.jpeg", name: "yoga", matched: false },
  { src: "/img/gift2.jpeg", name: "gift", matched: false },
  { src: "/img/gift2.jpeg", name: "gift", matched: false },
];

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<Card | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);

  //shuffle
  const shuffleCards = () => {
    const shuffledCards: Card[] = [...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setWin(false);
  };

  // handle choice
  const handleChoice: (clickedCard: Card) => void = (clickedCard: Card) => {
    choiceOne ? setChoiceTwo(clickedCard) : setChoiceOne(clickedCard);
  };

  //compare choices
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.name === choiceTwo.name) {
        setCards((prevCards) => {
          return prevCards.map((card) =>
            card.name === choiceOne.name ? { ...card, matched: true } : card
          );
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Check for win
  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length > 0) {
      setWin(true);
      setTimeout(() => hideCards(), 3500);
    }
  }, [cards]);

  //hide cards after win
  const hideCards: () => void = () => {
    const cardElements = document.querySelectorAll<HTMLDivElement>(".card");
    cardElements.forEach((card) => {
      card.classList.add("hidden");
    });
  };

  //reset choices, increase turn count
  const resetTurn: () => void = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //auto-start game
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Bree's Birthday Memory Quest</h1>
      <button
        className={`new-game ${win ? "hidden" : ""}`}
        onClick={shuffleCards}
      >
        New Game
      </button>

      <div className={`card-grid ${win ? "win" : ""}`}>
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
            win={win}
          />
        ))}
      </div>
      {win && (
        <div>
          <p>Congratulations! You've won!</p>
          <p>
            You completed the first stage of your quest in {turns} turns.
            {turns <= 16 && ` A wonderful start!`}
            {turns > 16 && turns < 24 && ` An acceptable beginning.`}
            {turns >= 24 && ` A rocky start, but your comrades believe in you!`}
          </p>
          <p>
            Your journey now leads you offscreen. Find the five favoured havens
            of your faithful steed; Frankie.
          </p>
          <p>Bountiful treasures await you, good luck!</p>
          <img src="/img/map.jpeg" alt="" />
        </div>
      )}
    </div>
  );
}

export default App;
