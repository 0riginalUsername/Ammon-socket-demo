

export default function roomKey(key){
    return async (dispatch) => {
        dispatch({type: 'getKey', payload: key})
    }
}