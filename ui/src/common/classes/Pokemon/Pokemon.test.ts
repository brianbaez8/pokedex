import { describe, expect, test } from '@jest/globals';

import { Pokemon } from './Pokemon';

const TEST_POKEMON_DATA = {
  name: 'pikachu',
  types: ['electric'],
  weight: 60,
  height: 4,
  order: 35
}

describe('Pokemon Class', () => {
  const pokemon = new Pokemon(TEST_POKEMON_DATA);
  test('it should get the name', () => {
    expect(pokemon.getName()).toBe('pikachu');
  })
  test('it should get the types', () => {
    expect(pokemon.getTypesString()).toEqual(['electric']);
  })
  test('it should get the weight', () => {
    expect(pokemon.getWeight()).toBe(60);
  })
  test('it should get the height', () => {
    expect(pokemon.getHeight).toBe(4);
  })
  test('it should get the order', () => {
    expect(pokemon.getOrder()).toBe(35);
  })
  test('it should get the next evolution name', () => {
    expect(pokemon.getNextEvolutionName()).toBe('raichu')
  })
})