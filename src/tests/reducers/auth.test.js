import authReducer from '../../reducers/auth'

test('should set default state', () => {
  const state = authReducer(undefined, { type: '@@INIT' })
  expect(state).toEqual({})
})

test('should set uid on login', () => {
  const action = {
    type: 'LOGIN',
    uid: 'abc123'
  }

  const state = authReducer(undefined, action)
  expect(state).toEqual({ uid: 'abc123' })
})

test('should remove uid on logout', () => {
  const action = { type: 'LOGOUT' }

  const state = authReducer(undefined, action)
  expect(state).toEqual({})
})
