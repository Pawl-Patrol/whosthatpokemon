import React from 'react';
import './App.css';

import './data/Types.css';
import pokeapi from './data/pokemons.json';
import typeapi from './data/types.json';

const randID = () => Math.floor(Math.random()*pokeapi.length);

export default class App extends React.Component {
  state = {
    pokemon: pokeapi[randID()],
    skip: false
  };
  input = React.createRef<HTMLInputElement>();
  types = [
    React.createRef<HTMLDivElement>(),
    React.createRef<HTMLDivElement>()
  ]
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div className="app">
      <div className="grid">
        <div className="guess">
          <h1>Who's that Pokemon?</h1>
          <img src={this.state.pokemon.img}/>
          <input type="text" ref={this.input} onDrop={undefined} onChange={this.onChange.bind(this)}/>
        </div>
        <div className="types-drop">
          {this.state.pokemon.types.map((_, i) => 
            <div
              ref={this.types[i]}
              className="type drop"
              onDragEnter={this.onDragEnter.bind(this)}
              onDragLeave={this.onDragLeave.bind(this)}
              onDragOver={this.onDragOver.bind(this)}
              onDrop={this.onDragDrop.bind(this)}
            ></div>
          )}
        </div>
        <div className="types-drag">
          {Object.getOwnPropertyNames(typeapi).map(type => 
            <div
              className="type drag"
              id={type}
              draggable={true}
              onDragStart={this.onDragStart.bind(this)}
              onDragEnd={this.onDragEnd.bind(this)}
            >{(typeapi as any)[type]}</div>
          )}
        </div>
        <button className="skip" onClick={this.onClick.bind(this)}><h2>{this.state.skip ? "weiter" : "anzeigen"}</h2></button>
      </div>
    </div>
  }
  roll() {
    this.state.pokemon = pokeapi[randID()];
    this.types.map((type) => {
      if (type.current) type.current.id = "";
    })
    this.input.current!.value = "";
    this.input.current!.classList.remove('correct');
    this.input.current!.disabled = false;
  }
  check() {
    if (this.input.current!.value.toLocaleLowerCase() !== this.state.pokemon.name.toLowerCase()) return;
  
    var types: string[] = [];
    this.types.map((type) => {
      if (type.current) types.push(type.current.id);
    })
  
    for (var type of this.state.pokemon.types) {
      if (!types.includes(type)) return;
    }

    this.roll();
    this.setState(this.state);
  }
  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.toLowerCase() == this.state.pokemon.name.toLowerCase()) {
      e.target.classList.add('correct');
      e.target.disabled = true;
    }
    this.check();
  }
  onClick() {
    if (this.state.skip) {
      this.roll();
    } else {
      this.input.current!.value = this.state.pokemon.name;
      this.input.current!.disabled = true;
      this.types.map((type, i) => {
        if (type.current) type.current.id = this.state.pokemon.types[i];
      })
    }
    this.state.skip = !this.state.skip;
    this.setState(this.state);
  }
  onDragStart(e: React.DragEvent<HTMLDivElement>) {
    const target = e.target! as HTMLDivElement;
    e.dataTransfer?.setData('type', target.id);
    setTimeout(() => {
      target.classList.add('dragged');
    }, 0);
  }
  onDragEnd(e: React.DragEvent<HTMLDivElement>) {
    const target = e.target! as HTMLDivElement;
    target.classList.remove('dragged');
  }
  onDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const target = e.target! as HTMLDivElement;
    target.classList.add('drag-over');
  }
  onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    const target = e.target! as HTMLDivElement;
    target.classList.remove('drag-over');
  }
  onDragDrop(e: React.DragEvent<HTMLDivElement>) {
    const target = e.target! as HTMLDivElement;
    target.classList.remove('drag-over');
    const type = e.dataTransfer.getData('type');
    if (this.state.pokemon.types.includes(type)) {
      target.id = type;
      this.check();
    }
  }
}