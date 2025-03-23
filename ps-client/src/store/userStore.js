import axios from 'axios';

export default {
  state: {
    users: [],
    searchQuery: '',
    isSearchVisible: true,
    showSearchButton: true,
    loading: false, // Indicador de carregamento
  },
  getters: {
    filteredUsers(state) {
      return state.users.filter(user =>
        user.username?.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setSearchVisibility(state, isVisible) {
      state.isSearchVisible = isVisible;
    },
    setShowSearchButton(state, show) {
      state.showSearchButton = show;
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
  },
  actions: {
    async buscarDados({ commit }) {
      commit('setLoading', true); // Inicia o carregamento

      try {
        const response = await axios.get('https://api.exemplo.com/users'); // URL da sua API
        console.log('Dados da API:', response.data);
        commit('setUsers', response.data);
        commit('setSearchVisibility', false);
        commit('setShowSearchButton', false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        commit('setUsers', []);
      } finally {
        commit('setLoading', false); // Finaliza o carregamento
      }
    },
    resetSearch({ commit }) {
      commit('setSearchQuery', '');
      commit('setSearchVisibility', true);
      commit('setShowSearchButton', true);
    },
  }
};
