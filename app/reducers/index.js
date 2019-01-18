import axios from 'axios'

// ACTION TYPES

const GET_SCENARIOS = 'GET_SCENARIOS';
const GET_SCENARIO = 'GET_SCENARIO'

// ACTION CREATORS

export const getScenarios = (scenarios) => {
  return { type: GET_SCENARIOS, scenarios };
}

export const getScenario = (scenario) => {
  return { type: GET_SCENARIO, scenario };
}



// THUNK CREATORS

export const fetchScenarios = () => {
  return async (dispatch) => {
    const {data} = await axios.get('/api/scenarios');
    dispatch(getScenario(data));
  }
}

// INITIAL STATE

const initialState = {
  currentEmotion: '',
  scenarios: [],
  scenariosIdx: 0,
  scenario: {},
  successfulEmotion: ''
}

// REDUCER

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SCENARIOS:
      return {
        ...state,
        scenarios: action.scenarios
      }
    case GET_SCENARIO:
    return {
      ...state,
      selected: action.scenario
    }
    default:
      return state
  }
}

export default reducer