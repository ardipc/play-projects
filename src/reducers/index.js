import { combineReducers } from 'redux'

import myUserReducer from './myUser'

const rootReducer = combineReducers({
  myUser: myUserReducer
})

export default rootReducer
