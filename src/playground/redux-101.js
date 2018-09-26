import { createStore } from 'redux'

const incrementCount = ({ increment = 1 } = {}) => ({
  type: 'INCREMENT',
  increment
})

const decrementCount = ({ decrement = 1 } = {}) => ({
  type: 'DECREMENT',
  decrement
})

const resetCount = () => ({
  type: 'RESET'
})

const setCount = ({ count }) => ({
  type: 'SET',
  count
})

const countReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + action.increment
      }
    case 'DECREMENT':
      return {
        count: state.count - action.decrement
      }
    case 'RESET':
      return {
        count: 0
      }
    case 'SET':
      return {
        count: action.count
      }
    default:
      return state
  }
}

const store = createStore(countReducer)

store.subscribe(() => {
  console.log(store.getState())
})

store.dispatch( incrementCount({ increment: 5 }) )
store.dispatch( resetCount() )
store.dispatch( decrementCount({ decrement: 10 }) )
store.dispatch( setCount({ count: 1 }) )
