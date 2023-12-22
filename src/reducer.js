const initialState = { key: ''}


 function reducer(state = initialState, action) {
    switch (action.type) {
        case 'getkey':
            return {...state, key: action.payload }
        default:
            return state
    }
}

export default reducer