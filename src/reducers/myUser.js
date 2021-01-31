import * as actions from '../actions/myUser'

export const initState = {
  user: {},
  loading: false,
  hasErrors: false
}

export default function myUserReducer(state = initState, action) {
  switch(action.type) {
    case actions.GET_USER:
      return { ...state, loading: true }
    case actions.GET_USER_SUCCESS:
      return { ...state, user: action.payload, loading: false, hasErrors: false }
    case actions.GET_USER_ERROR:
      return { ...state, loading: false, hasErrors: true }

    default:
      return state
  }
}
