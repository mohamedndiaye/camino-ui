import Vue from 'vue'
import { titres } from '../api'
import { titreFormat, metaFormat } from './_utils'

export const state = {
  liste: null,
  domaines:
    // null,
    [
      {
        checked: true,
        id: 'h',
        nom: 'hydrocarbures liquides ou gazeux'
      }
    ],
  types:
    // null,
    [
      { checked: true, id: 'cxx', nom: 'concession' },
      {
        checked: true,
        id: 'prh',
        nom: 'permis exclusif de recherches'
      },
      {
        checked: true,
        id: 'pxh',
        nom: "permis d'exploitation"
      }
    ],
  statuts:
    // null,
    [
      {
        checked: true,
        id: 'dmc',
        nom: 'demande classée',
        couleur: 'neutral'
      },
      {
        checked: true,
        id: 'dmi',
        nom: 'demande initiale',
        couleur: 'warning'
      },
      {
        checked: true,
        id: 'ind',
        nom: 'indéterminé',
        couleur: 'warning'
      },
      {
        checked: true,
        id: 'mod',
        nom: 'modification en instance',
        couleur: 'warning'
      },
      {
        checked: true,
        id: 'val',
        nom: 'valide',
        couleur: 'success'
      }
    ],
  substances: null,
  noms: null
}

export const actions = {
  filterInput({ state, dispatch, commit }, { name, value }) {
    const values = value ? value.split(/[ ,]+/) : null
    commit('filterInput', { name, values })
    dispatch('get')
  },
  filterToggle({ state, dispatch, commit }, { name, value, property }) {
    state[name]
      .filter(e => e[property].toString() === value)
      .forEach(f => commit('filterToggle', f))
    dispatch('get')
  },
  async get({ state, dispatch, commit }) {
    const args = {
      typeIds: state.types && state.types.filter(e => e.checked).map(e => e.id),
      domaineIds:
        state.domaines && state.domaines.filter(e => e.checked).map(e => e.id),
      statutIds:
        state.statuts && state.statuts.filter(e => e.checked).map(e => e.id),
      substances: state.substances,
      noms: state.noms
    }

    const a = Object.keys(args).reduce(
      (res, key) =>
        args[key] ? Object.assign(res, { [key]: args[key] }) : res,
      {}
    )

    const data = await titres(a)

    if (data) {
      commit('set', data.titres.map(t => titreFormat(t)))

      if (!args.typeIds) {
        commit('typesSet', data.metas.types.map(v => metaFormat(v)))
      }
      if (!args.domaineIds) {
        commit('domainesSet', data.metas.domaines.map(v => metaFormat(v)))
      }
      if (!args.statutIds) {
        commit('statutsSet', data.metas.statuts.map(v => metaFormat(v)))
      }
    } else {
      dispatch('errorApi', null, { root: true })
    }
  }
}

export const getters = {}

export const mutations = {
  set(state, titres) {
    Vue.set(state, 'liste', titres)
  },
  typesSet(state, types) {
    Vue.set(state, 'types', types)
  },
  domainesSet(state, domaines) {
    Vue.set(state, 'domaines', domaines)
  },
  statutsSet(state, statuts) {
    Vue.set(state, 'statuts', statuts)
  },
  filterToggle(state, f) {
    Vue.set(f, 'checked', !f.checked)
  },
  filterInput(state, { name, values }) {
    Vue.set(state, name, values)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
