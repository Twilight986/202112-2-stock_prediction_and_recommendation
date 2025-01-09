
export const loginSuccessCreator = (userName) => {
  return {type: 'LOGIN_SUCCESS', payload: userName};
};

const initState = {
  login: false,  
  userName: 'not log in', // 
};

const reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {...state, login: true, userName: action.payload};
    default:
      return state;
  }
};

export default {initState, reducer};
