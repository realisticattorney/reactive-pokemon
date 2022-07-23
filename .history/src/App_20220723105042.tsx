import React, { useEffect, useState, useMemo } from 'react';
import { Pokemon, getAll, getByName } from './API';

import './styles.css';
interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0;
const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`tableRender = ${tableRender++}`);
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(',')}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const MemoedPokemonTable = React.memo(PokemonTable);

const ArrayWithAdd = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    fetch('numbers.json')
      .then((data) => data.json())
      .then(setNumbers);
  }, []);

  // const onSetNumbers = () =>
  //   setNumbers((prevArr) => [...prevArr, numbers.length + 1]);

  const onSetNumbers = () => {
    
    const arrToAdd =  Array(amount)
        .fill(1)
        .map((_, i) => numbers.length + 1 + i)
    
    return arrToAdd.forEach( setNumbers((prev) => [...prev, numbers.length + 1]);
  };

  const onSetAmount = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(parseInt(evt.target.value, 10));

  return (
    <div>
      <h1>{JSON.stringify(numbers)}</h1>
      {numbers.length > 0 && <button onClick={onSetNumbers}>ADD +</button>}
      <div>
        <button onClick={() => setAmount((prev) => prev + 1)}>+</button>
        <input type="text" value={amount} onChange={onSetAmount} />
        <button
          disabled={amount <= 1}
          onClick={() => setAmount((prev) => prev - 1)}
        >
          -
        </button>
      </div>
    </div>
  );
};

let renders = 0;
export default function App() {
  console.log(`renders ${renders++}`);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    getAll().then(setPokemon);
  }, []);

  // const pokemonWithPower = pokemon.map((p) => ({
  //   ...p,
  //   power: calculatePower(p),
  // }));

  const pokemonWithPower = useMemo(
    () =>
      pokemon.map((p) => ({
        ...p,
        power: calculatePower(p),
      })),
    [pokemon]
  );

  //.filter((p) => p.power > threshold),

  const onCountThreshold = pokemonWithPower.filter(
    (p) => p.power > threshold
  ).length;

  const onPowerThresholdChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setThreshold(parseInt(evt.target.value, 10));

  return (
    <div>
      <ArrayWithAdd />
      <div className="top-bar">
        <div>Search</div>
        <input type="text"></input>
        <div>Power threshold</div>
        <input
          value={threshold ? threshold : ''}
          onChange={onPowerThresholdChange}
          type="text"
        ></input>
        <div>Count over threshold: {onCountThreshold}</div>
      </div>
      <div className="two-column">
        <MemoedPokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: </div>
          <div>Max: </div>
        </div>
      </div>
    </div>
  );
}
