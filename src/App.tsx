import React from 'react';
import './App.css';

import './data/Types.css';
import pokeapi from './data/pokemons.json';
import typeapi from './data/types.json';

const randID = () => Math.floor(Math.random()*pokeapi.length);

export default class App extends React.Component {
  state = {
    pokemon: pokeapi[randID()],
    correct: 0,
    incorrect: 0,
    skip: false
  };
  input = React.createRef<HTMLInputElement>();
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div className="app">
      <div className="grid">
        <div className="guess">
          <h1>Who's that Pokemon?</h1>
          <div className="pokemon">
            <div className="types">
              {this.state.pokemon.types.map((t: string) => 
                <span className={t}>{(typeapi as any)[t]}</span>
              )}
            </div>
            <img src={this.state.pokemon.img}/>
          </div>
          <input type="text" ref={this.input} onChange={this.onInput.bind(this)}/>
        </div>
        <span className="correct">{this.state.correct}</span>
        <span className="incorrect">{this.state.incorrect}</span>
        <button className="skip" onClick={this.onSkip.bind(this)}><h2>{this.state.skip ? "weiter" : "anzeigen"}</h2></button>
      </div>
    </div>
  }
  updateState() {
    this.setState(this.state);
  }
  roll() {
    this.state.pokemon = pokeapi[randID()];
    this.input.current!.value = "";
  }
  onInput() {
    if (this.input.current!.value.toLowerCase() == this.state.pokemon.name.toLowerCase()) {
      this.state.correct++;
      this.roll();
      this.updateState();
    }
  }
  onSkip() {
    if (this.state.skip) {
      this.roll();
    } else {
      this.state.incorrect++;
      this.input.current!.value = this.state.pokemon.name;
    }
    this.input.current!.disabled = !this.state.skip;
    this.state.skip = !this.state.skip;
    this.updateState();
  }
}