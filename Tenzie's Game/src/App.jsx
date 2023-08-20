import { useState,useEffect } from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [tenzies,setTenzies]=useState(false);
  const [rollCount,setRollCount]=useState(0);
  const [bestScore,setBestScore]=useState((localStorage.getItem("bestScore")) || 10000);
  const allNewDices=()=>{
    const newDice=[];

    for(let i=0;i<10;i++)
    {
      newDice.push({value: Math.ceil(Math.random()*6) ,isHeld :false,id:nanoid()})
    }
    return newDice;
  };
  const [dice,setDice]=useState(allNewDices());
  
  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
}
  const resetScore=()=>{
    setBestScore(10000);
    localStorage.clear();
  }


useEffect(()=>{
  const allHeld=dice.every(die=>die.isHeld);
  const firstValue=dice[0].value;
  const allSameValue=dice.every(die=>die.value===firstValue);
  if(allHeld && allSameValue)
  {
    setTenzies(true);
    console.log("You Won");
  }
},[dice]);


  const rollDice=()=>{
    setRollCount(rollCount+1);
    if(tenzies)
    {
      setDice(allNewDices);
      setTenzies(false);
      console.log(rollCount);
      setRollCount(0);
      if(bestScore>rollCount)
      setBestScore(rollCount);
      localStorage.setItem("bestScore",bestScore);
      return;
    }

    setDice(oldDice=>oldDice.map(die=>{
      return die.isHeld? die:generateNewDie();

    }));
  }
  const holdDice=(e,id)=>{
    const newVals=dice.map(die=>{
      if(die.id===id)
        die.isHeld=!die.isHeld;
      return die;
    })
    setDice(newVals);
  }

  const diceElements=dice.map(die=><Die value={die.value} key={die.id} isHeld={die.isHeld} id={die.id} holdDice={holdDice} ></Die>)

  return (
    <main>
      {tenzies && <Confetti
    /> }
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
         {diceElements}
      </div>
      <h2>Your Rolls= {rollCount}</h2>
      <h2>Best Score= {bestScore===10000?"No best Score":bestScore}</h2>
      <button className='reset-btn' onClick={resetScore}>Reset Best Score</button>
      <button className='roll-dice' onClick={rollDice}>{tenzies?"Play Again":"Roll"}</button>
    </main>
  )
}

export default App;
