import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type RouteParams = RouteProp<RootStackParamList, 'PokemonDetail'>;

export const PokemonDetailScreen = () => {
  const route = useRoute<RouteParams>();
  const { pokemon } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.label}>Tipos:</Text>
      <Text>{pokemon.types.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  label: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
});
