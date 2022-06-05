import json
import os

pkmns = []
base = './pokeapi/'

for directory in os.listdir(base + 'pokemon-species'):
    if (directory == 'index.json'):
        continue

    with open(base + 'pokemon-species/' + directory + "/index.json", "r") as f:
        species = json.load(f)
    with open(base + 'pokemon/' + directory + "/index.json", "r") as f:
        pokemon = json.load(f)

    for generation in pokemon["game_indices"]:
        if generation["version"]["name"] == "black":
            pkmn = {
                "id": generation["game_index"],
                "name": list(filter(lambda k: k["language"]["name"] == "de", species["names"]))[0]["name"],
                "img": pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"],
                "types": [t["type"]["name"] for t in pokemon["types"]]
            }
            break
    else:
        continue

    pkmns.append(pkmn)
    print(pkmn["id"])

pkmns.sort(key=lambda x: x.pop("id"))

with open("pokemons.json", "w") as file:
    json.dump(pkmns, file)