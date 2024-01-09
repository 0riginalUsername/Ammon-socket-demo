const initialState = { key: ''}


 function reducer(state = initialState, action) {
    switch (action.type) {
        case 'getKey':
            return {...state, key: action.payload }
        case 'getPlayers':
            return {...state, clients: action.payload}
        case 'getUsername':
            return {...state, username: action.payload}
        case 'getUsernames':
            return {...state, usernames: action.payload}
        default:
            return state
        
    }
}

export default reducer