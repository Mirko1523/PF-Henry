
import { GET_FOOD, GET_PAIS, SIGNUP_USER_EMAIL, GET_FILTRO, SIGNUP_USER_EMAIL_DB, GET_ALL_USERS, GET_SEARCH_BY_EMAIL, PUT_USER_BLOCK } from '../actions/ActionsTypes';



interface Plato {
  id: number;
  nombre: string;
  origen: string;
  ingredientes: string[];
  kilocalorias: number;
  carbohidratos: number;
  grasas: number;
  peso: number;
  precio: number;
  tipo: string;
  imagen: string;
  descripcion: string;
  stock: string;
}

export interface StoreState {
  platos: Plato[];
  filtros: Plato[];
  pais: string;
  tipo: string;
  users: [];
  searchEmail: [];
  block: [];
}

export interface Action {
  type: string;
  payload: any;
}

const initialState: StoreState = {
  platos: [],
  filtros: [],
  pais: 'Todos',
  tipo: 'Todosa',
  users: [],
  searchEmail: [],
  block: [],
};


const Reducer = (state: StoreState = initialState, action: Action): StoreState => {
  switch (action.type) {
    case GET_FILTRO:
      action.payload.sort((a : any, b :any) => {
        // Convertir los nombres a minúsculas para un ordenamiento sin distinción de mayúsculas/minúsculas
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        // Comparar los nombres y devolver el resultado de la comparación
        if (nombreA < nombreB) return -1;
        if (nombreA > nombreB) return 1;
        return 0;
    });
      return{
        ...state, 
        filtros: action.payload
      };
    case GET_FOOD:
      
      return{
        ...state, 
        platos: action.payload,
        filtros: action.payload
      };
    case GET_PAIS:
      let final = state.platos;
      if (action.payload === 'Todos' || action.payload === 'Argentina' || action.payload === 'Colombia' || action.payload === 'Mexico' || action.payload === 'Ecuador') {
        state.pais = action.payload;
      }
      if (action.payload === 'Todosa' || action.payload === 'plato fuerte' || action.payload === 'postre' || action.payload === 'plato vegano') {
        state.tipo = action.payload;
      }
      if (action.payload === 'Todos') {} 
      else if (state.pais === 'Argentina') {
        final = final.filter((character) => character.origen === 'Argentina');
      } else if (state.pais  === 'Mexico') {
        final = final.filter((character) => character.origen === 'Mexico');
      } else if (state.pais  === 'Colombia') {
        final = final.filter((character) => character.origen === 'Colombia');
      } else if (state.pais === 'Ecuador') {
        final = final.filter((character) => character.origen === 'Ecuador');
      }
      if (state.tipo === 'Todosa') {} 
      else if (state.tipo === 'plato fuerte' ) {
        final = final.filter((character) => character.tipo === 'plato fuerte' );
      } else if (state.tipo === 'postre') {
        final = final.filter((character) => character.tipo === 'postre');
      } else if (state.tipo === 'plato vegano') {
        final = final.filter((character) => character.tipo === 'plato vegano');
      }  
      return {
        ...state,
        filtros: final,
      };
    case SIGNUP_USER_EMAIL:
      return {
        ...state,
      };
      case SIGNUP_USER_EMAIL_DB:
        return {
          ...state,
        };
      case GET_ALL_USERS:
        return{
          ...state,
          users: action.payload,
        }
      case GET_SEARCH_BY_EMAIL: {
        return {
          ...state,
          searchEmail: action.payload,
        }
      }
      case PUT_USER_BLOCK:
      return {
        ...state,
        block: action.payload,
      }
    default:
      return state;
  }
};

export default Reducer;
