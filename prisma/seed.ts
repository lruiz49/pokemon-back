import { PrismaClient, Type, MoveCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    
  const overgrow = await prisma.ability.upsert({
    where: { name: 'Overgrow' },
    update: {},
    create: {
      name: 'Overgrow',
      description: 'Boosts the power of Grass-type moves when the Pokémon is in trouble.',
    },
  });

  const blaze = await prisma.ability.upsert({
    where: { name: 'Blaze' },
    update: {},
    create: {
      name: 'Blaze',
      description: 'Boosts the power of Fire-type moves when the Pokémon is in trouble.',
    },
  });

  const vineWhip = await prisma.move.upsert({
    where: { name: 'Vine Whip' },
    update: {},
    create: {
      name: 'Vine Whip',
      description: 'The target is struck with slender, whiplike vines.',
      type: Type.GRASS,
      category: MoveCategory.PHYSICAL,
    },
  });

  const ember = await prisma.move.upsert({
    where: { name: 'Ember' },
    update: {},
    create: {
      name: 'Ember',
      description: 'The target is attacked with small flames.',
      type: Type.FIRE,
      category: MoveCategory.SPECIAL,
    },
  });

  await prisma.pokemon.upsert({
    where: { name: 'Bulbasaur' },
    update: {},
    create: {
      name: 'Bulbasaur',
      description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
      type1: Type.GRASS,
      type2: Type.POISON,
      height: 70, // cm
      weight: 6.9, // kg
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      abilityId: overgrow.id,
      moves: {
        connect: [{ id: vineWhip.id }],
      },
    },
  });

  await prisma.pokemon.upsert({
    where: { name: 'Charmander' },
    update: {},
    create: {
      name: 'Charmander',
      description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.',
      type1: Type.FIRE,
      height: 60,
      weight: 8.5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
      abilityId: blaze.id,
      moves: {
        connect: [{ id: ember.id }],
      },
    },
  });
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