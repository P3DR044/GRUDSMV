import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator
} from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const list = await getPokemons(30, 0);
        const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
        setPokemons(details);
        setOffset(30);
      } catch (err) {
        setError('Falha ao carregar Pokémons. Verifique sua conexão.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadMorePokemons = async () => {
    if (loadingMore || isLoading || search) return;

    setLoadingMore(true);
    try {
      const list = await getPokemons(30, offset);
      const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
      setPokemons(prev => [...prev, ...details]);
      setOffset(prev => prev + 30);
    } catch (err) {
      console.error('Erro ao carregar mais pokémons', err);
    } finally {
      setLoadingMore(false);
    }
  };


  const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.input}
        onChangeText={setSearch}
        value={search}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <Text style={styles.loadingMore}>Carregando mais Pokémons...</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.message}>
              {search
                ? `Nenhum pokémon encontrado para "${search}".`
                : 'Nenhum pokémon disponível.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#3b4cca',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    padding: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  list: {
    paddingBottom: 40,
  },
  loadingMore: {
    paddingVertical: 20,
    textAlign: 'center',
    color: '#888',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    color: '#999',
  },
});