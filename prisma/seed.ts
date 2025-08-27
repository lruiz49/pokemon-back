import { PrismaClient, Type, MoveCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureAbility(name: string, description: string) {
  return prisma.ability.upsert({
    where: { name },
    update: {},
    create: { name, description },
  });
}

type MoveSpec = {
  name: string;
  description: string;
  type: Type;
  category: MoveCategory;
};

async function ensureMove(spec: MoveSpec) {
  return prisma.move.upsert({
    where: { name: spec.name },
    update: {},
    create: spec,
  });
}

async function main() {
  // === Abilities ===
  const abilitySpecs = [
    { name: 'Overgrow',     description: 'Boosts the power of Grass-type moves when in a pinch.' },
    { name: 'Blaze',        description: 'Boosts the power of Fire-type moves when in a pinch.' },
    { name: 'Torrent',      description: 'Boosts the power of Water-type moves when in a pinch.' },
    { name: 'Shield Dust',  description: 'Blocks additional effects of attacks taken.' },
    { name: 'Shed Skin',    description: 'May heal its own status conditions.' },
    { name: 'Compound Eyes',description: 'Boosts the Pokémon’s accuracy.' },
    { name: 'Swarm',        description: 'Powers up Bug-type moves in a pinch.' },
    { name: 'Keen Eye',     description: 'Prevents accuracy from being lowered.' },
    { name: 'Run Away',     description: 'Enables a sure getaway from wild Pokémon.' },
    { name: 'Guts',         description: 'Boosts Attack if it has a status condition.' },
    { name: 'Intimidate',   description: 'Lowers the opposing Pokémon’s Attack.' },
    { name: 'Static',       description: 'Contact may cause paralysis.' },
    { name: 'Lightning Rod',description: 'Draws in all Electric-type moves.' },
    { name: 'Sand Veil',    description: 'Boosts evasion in a sandstorm.' },
    { name: 'Poison Point', description: 'Contact may poison the attacker.' },
    { name: 'Rivalry',      description: 'Deals more damage to the same gender.' },
    { name: 'Cute Charm',   description: 'Contact may cause infatuation.' },
    { name: 'Flash Fire',   description: 'Powers up Fire-type moves if hit by one.' },
    { name: 'Inner Focus',  description: 'Prevents flinching.' },
    { name: 'Chlorophyll',  description: 'Boosts the Pokémon’s Speed in sunshine.' },
    { name: 'Effect Spore', description: 'Contact may inflict poison, paralysis, or sleep.' },
    { name: 'Arena Trap',   description: 'Prevents opposing Pokémon from fleeing.' },
    { name: 'Big Pecks',    description: 'Protects the Pokémon from Defense-lowering effects.' },
    { name: 'Tangled Feet', description: 'Raises evasion if confused.' },
    // new ones for extra Pokémon
    { name: 'Cursed Body',  description: 'May disable a move used on the Pokémon.' },
    { name: 'Rock Head',    description: 'Protects from recoil damage.' },
    { name: 'Water Absorb', description: 'Restores HP if hit by a Water-type move.' },
    { name: 'Volt Absorb',  description: 'Restores HP if hit by an Electric-type move.' },
    { name: 'Thick Fat',    description: 'Halves damage from Fire- and Ice-type moves.' },
    { name: 'Clear Body',   description: 'Prevents stat reduction.' },
    { name: 'Pressure',     description: 'The Pokémon raises opposing Pokémon’s PP usage.' },
  ];

  const abilitiesMap: Record<string, number> = {};
  for (const a of abilitySpecs) {
    const created = await ensureAbility(a.name, a.description);
    abilitiesMap[a.name] = created.id;
  }

  // === Moves ===
  const moveSpecs: MoveSpec[] = [
    // Normal
    { name: 'Tackle', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'A full-body charge.' },
    { name: 'Scratch', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'Claws rake the target.' },
    { name: 'Quick Attack', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'An almost invisibly fast attack.' },
    { name: 'Body Slam', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'Drops onto the target with full body weight.' },
    { name: 'Hyper Fang', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'Bites hard with incisors.' },
    { name: 'Double-Edge', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'A reckless tackle.' },
    { name: 'Slash', type: Type.NORMAL, category: MoveCategory.PHYSICAL, description: 'Slashes with sharp claws.' },
    // Flying
    { name: 'Gust', type: Type.FLYING, category: MoveCategory.SPECIAL, description: 'A gust of wind whipped up by wings.' },
    { name: 'Peck', type: Type.FLYING, category: MoveCategory.PHYSICAL, description: 'The target is jabbed with a beak.' },
    { name: 'Wing Attack', type: Type.FLYING, category: MoveCategory.PHYSICAL, description: 'Strikes with wings.' },
    // Grass
    { name: 'Vine Whip', type: Type.GRASS, category: MoveCategory.PHYSICAL, description: 'Struck with slender vines.' },
    { name: 'Razor Leaf', type: Type.GRASS, category: MoveCategory.PHYSICAL, description: 'Launches razor-sharp leaves.' },
    { name: 'Absorb', type: Type.GRASS, category: MoveCategory.SPECIAL, description: 'A nutrient-draining attack.' },
    { name: 'Mega Drain', type: Type.GRASS, category: MoveCategory.SPECIAL, description: 'Absorbs half the damage inflicted.' },
    // Fire
    { name: 'Ember', type: Type.FIRE, category: MoveCategory.SPECIAL, description: 'Attacks with small flames.' },
    { name: 'Flamethrower', type: Type.FIRE, category: MoveCategory.SPECIAL, description: 'Engulfs the target in flames.' },
    { name: 'Fire Spin', type: Type.FIRE, category: MoveCategory.SPECIAL, description: 'Traps the target in fire.' },
    // Water
    { name: 'Water Gun', type: Type.WATER, category: MoveCategory.SPECIAL, description: 'Squirts water to attack.' },
    { name: 'Bubble Beam', type: Type.WATER, category: MoveCategory.SPECIAL, description: 'Sprays bubbles at the target.' },
    { name: 'Surf', type: Type.WATER, category: MoveCategory.SPECIAL, description: 'Attacks with a big wave.' },
    // Bug
    { name: 'Leech Life', type: Type.BUG, category: MoveCategory.PHYSICAL, description: 'Drains the target’s blood.' },
    { name: 'Twinneedle', type: Type.BUG, category: MoveCategory.PHYSICAL, description: 'Jabs the target twice.' },
    { name: 'Bug Bite', type: Type.BUG, category: MoveCategory.PHYSICAL, description: 'Bites the target.' },
    // Poison
    { name: 'Poison Sting', type: Type.POISON, category: MoveCategory.PHYSICAL, description: 'Stabs with a poisonous stinger.' },
    { name: 'Acid', type: Type.POISON, category: MoveCategory.SPECIAL, description: 'Sprays a corrosive fluid.' },
    { name: 'Sludge', type: Type.POISON, category: MoveCategory.SPECIAL, description: 'Hurls unsanitary sludge.' },
    // Electric
    { name: 'Thunder Shock', type: Type.ELECTRIC, category: MoveCategory.SPECIAL, description: 'A jolt of electricity.' },
    { name: 'Thunderbolt', type: Type.ELECTRIC, category: MoveCategory.SPECIAL, description: 'A strong electric blast.' },
    // Ground / Rock
    { name: 'Dig', type: Type.GROUND, category: MoveCategory.PHYSICAL, description: 'Digs underground, then strikes.' },
    { name: 'Earthquake', type: Type.GROUND, category: MoveCategory.PHYSICAL, description: 'A powerful quake.' },
    { name: 'Rock Slide', type: Type.ROCK, category: MoveCategory.PHYSICAL, description: 'Hurls large boulders.' },
    // Extra coverage
    { name: 'Psychic', type: Type.PSYCHIC, category: MoveCategory.SPECIAL, description: 'Attacks with mental power.' },
    { name: 'Confusion', type: Type.PSYCHIC, category: MoveCategory.SPECIAL, description: 'Weak telekinetic attack.' },
    { name: 'Bite', type: Type.DARK, category: MoveCategory.PHYSICAL, description: 'Bites with sharp fangs.' },
    { name: 'Crunch', type: Type.DARK, category: MoveCategory.PHYSICAL, description: 'Crunches with sharp fangs.' },
    { name: 'Dragon Claw', type: Type.DRAGON, category: MoveCategory.PHYSICAL, description: 'Slashes the target with sharp claws.' },
    { name: 'Ice Beam', type: Type.ICE, category: MoveCategory.SPECIAL, description: 'Shoots an icy beam.' },
    { name: 'Iron Tail', type: Type.STEEL, category: MoveCategory.PHYSICAL, description: 'Strikes with a hard tail.' },
  ];

  const movesMap: Record<string, number> = {};
  for (const m of moveSpecs) {
    const created = await ensureMove(m);
    movesMap[m.name] = created.id;
  }

  // Helpers
  const img = (dex: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex}.png`;
  const mv = (...names: string[]) => ({ connect: names.map((n) => ({ id: movesMap[n] })) });
  const ab = (name: string) => abilitiesMap[name];

  // === Pokémon #001–#050 (already included, omitted here for brevity) ===
  const pokemonData = [/* your first 50 mons here */];

  // === Extra Pokémon covering all types ===
  const extraPokemon = [
    { dex: 65, name: 'Alakazam', desc: 'Its brain can outperform a supercomputer.', 
      t1: Type.PSYCHIC, t2: undefined, h: 150, w: 48.0, ability: ab('Inner Focus'), 
      moves: mv('Psychic','Confusion','Body Slam') },
    { dex: 68, name: 'Machamp', desc: 'Can knock a train flying with one punch.', 
      t1: Type.FIGHTING, t2: undefined, h: 160, w: 130.0, ability: ab('Guts'), 
      moves: mv('Body Slam','Earthquake') },
    { dex: 94, name: 'Gengar', desc: 'Hides in shadows and steals life force.', 
      t1: Type.GHOST, t2: Type.POISON, h: 150, w: 40.5, ability: ab('Cursed Body'), 
      moves: mv('Sludge','Psychic') },
    { dex: 95, name: 'Onix', desc: 'Burrows at high speed twisting its huge body.', 
      t1: Type.ROCK, t2: Type.GROUND, h: 880, w: 210.0, ability: ab('Rock Head'), 
      moves: mv('Rock Slide','Earthquake') },
    { dex: 131, name: 'Lapras', desc: 'It ferries people across the sea.', 
      t1: Type.WATER, t2: Type.ICE, h: 250, w: 220.0, ability: ab('Water Absorb'), 
      moves: mv('Surf','Ice Beam','Body Slam') },
    { dex: 135, name: 'Jolteon', desc: 'Its fur is made of electrically charged needles.', 
      t1: Type.ELECTRIC, t2: undefined, h: 80, w: 24.5, ability: ab('Volt Absorb'), 
      moves: mv('Thunderbolt','Quick Attack') },
    { dex: 143, name: 'Snorlax', desc: 'Very lazy, it eats and sleeps all day.', 
      t1: Type.NORMAL, t2: undefined, h: 210, w: 460.0, ability: ab('Thick Fat'), 
      moves: mv('Body Slam','Earthquake') },
    { dex: 149, name: 'Dragonite', desc: 'Can fly around the globe in 16 hours.', 
      t1: Type.DRAGON, t2: Type.FLYING, h: 220, w: 210.0, ability: ab('Inner Focus'), 
      moves: mv('Dragon Claw','Wing Attack','Body Slam') },
    { dex: 197, name: 'Umbreon', desc: 'Evolved as darkness embraced it.', 
      t1: Type.DARK, t2: undefined, h: 100, w: 27.0, ability: ab('Inner Focus'), 
      moves: mv('Bite','Crunch') },
    { dex: 208, name: 'Steelix', desc: 'Its body has been compressed deep underground.', 
      t1: Type.STEEL, t2: Type.GROUND, h: 920, w: 400.0, ability: ab('Rock Head'), 
      moves: mv('Earthquake','Iron Tail') },
    { dex: 212, name: 'Scizor', desc: 'Its pincers crush anything.', 
      t1: Type.BUG, t2: Type.STEEL, h: 180, w: 118.0, ability: ab('Swarm'), 
      moves: mv('Slash','Bug Bite','Iron Tail') },
    { dex: 229, name: 'Houndoom', desc: 'The flames it breathes cause eternal pain.', 
      t1: Type.DARK, t2: Type.FIRE, h: 140, w: 35.0, ability: ab('Flash Fire'), 
      moves: mv('Flamethrower','Crunch') },
    { dex: 248, name: 'Tyranitar', desc: 'Its rage is truly destructive.', 
      t1: Type.ROCK, t2: Type.DARK, h: 200, w: 202.0, ability: ab('Sand Veil'), 
      moves: mv('Rock Slide','Crunch','Earthquake') },
    { dex: 376, name: 'Metagross', desc: 'A massive four-brained Pokémon.', 
      t1: Type.STEEL, t2: Type.PSYCHIC, h: 160, w: 550.0, ability: ab('Clear Body'), 
      moves: mv('Psychic','Iron Tail','Body Slam') },
    { dex: 461, name: 'Weavile', desc: 'Sharp claws can carve through ice.', 
      t1: Type.DARK, t2: Type.ICE, h: 110, w: 34.0, ability: ab('Pressure'), 
      moves: mv('Slash','Ice Beam') },
  ];

  // Seed both sets
  for (const p of [...pokemonData, ...extraPokemon]) {
    await prisma.pokemon.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        description: p.desc,
        type1: p.t1,
        type2: p.t2,
        height: p.h,
        weight: p.w,
        imageUrl: img(p.dex),
        abilityId: p.ability,
        moves: p.moves,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

  