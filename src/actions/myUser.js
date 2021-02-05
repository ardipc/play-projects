import axios from 'axios'

export const GET_USER         = 'GET_USER'
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
export const GET_USER_ERROR   = 'GET_USER_ERROR'

export const getUser = () => ({
  type: GET_USER
})

export const getUserSuccess = (myUser) => ({
  type: GET_USER_SUCCESS,
  payload: myUser
})

export const getUserError = () => ({
  type: GET_USER_ERROR
})

export function fetchMyUser() {
  return async (dispatch) => {
    dispatch(getUser())

    try{
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
      const data = await response.json()

      dispatch(getUserSuccess(data[0]))
    } catch(err) {
      dispatch(getUserError())
    }

  }
}
