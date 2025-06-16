# Proposta de Refatoração da Tela PokedexScreen usando MVVM

## Padrão Escolhido: MVVM
Escolhi o padrão **MVVM** (Model-View-ViewModel) por ser muito adequado para React com Hooks.  
Ele facilita o reaproveitamento da lógica, melhora a testabilidade e mantém a View (tela) limpa e focada apenas na UI.

## Nova Estrutura de Arquivos
```txt
PokedexApp/
├─ screens/
│  └─ Pokedex/
│     ├─ PokedexScreen.tsx              (View)
│     ├─ usePokedexViewModel.ts         (ViewModel)
│     └─ PokemonDetails/
│        ├─ PokemonDetailsScreen.tsx    (View)
│        ├─ usePokemonDetailsViewModel.ts (ViewModel)
├─ components/
│  ├─ PokemonCard.tsx
│  ├─ PokemonTypesList.tsx
│  ├─ PokemonHeader.tsx
├─ services/
│  └─ api.ts
├─ types/
│  ├─ Navigation.ts
│  └─ Pokemon.ts
├─ utils/
│  └─ format.ts

## Divisão de Responsabilidades
### View (`PokedexScreen.tsx`)
- Exibe a UI: título, campo de busca, lista de pokémons, mensagens de erro ou carregamento.  
- Consome o ViewModel para obter dados, estados e funções.  
- Responde a eventos (ex: digitação no campo de busca) chamando funções do ViewModel.

### ViewModel (`usePokedexViewModel.ts`)
- Contém estados internos: lista de pokémons, `isLoading`, `error`, `searchQuery`, `offset`, `loadingMore`.  
- Contém funções para carregar pokémons, carregar mais na paginação, atualizar o filtro de busca.  
- Gerencia toda a lógica de requisições, filtragem, paginação e tratamento de erros.  
- Expõe apenas os dados e métodos necessários para a View.

## Fluxo de Dados (Busca na Pokedex)
1. Usuário digita no campo `TextInput` da View.  
2. O evento `onChangeText` chama a função `setSearchQuery` no ViewModel.  
3. `setSearchQuery` atualiza o estado `searchQuery` no ViewModel.  
4. Um `useEffect` no ViewModel reage à mudança de `searchQuery` e filtra ou recarrega os dados conforme necessário.  
5. O estado filtrado é atualizado no ViewModel.  
6. A View recebe a lista atualizada via hook e re-renderiza a lista de pokémons.

