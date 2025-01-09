/**
 * 
 */


export const sidebarCollapseCreator = () => {
  return {type: 'SIDEBAR_COLLAPSE'};
};

const initState = {
  collapse: false, 
};

const reducer = (state = initState, action = {}) => {
  switch (action.type) {
    case 'SIDEBAR_COLLAPSE':
      return {...state, collapse: !state.collapse};
    default: 
      return state;
  }
};

export default {initState, reducer};
