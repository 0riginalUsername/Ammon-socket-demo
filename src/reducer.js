const initialState = { key: ''}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'getkey':
            return {...state, key: action.payload }
    }
}