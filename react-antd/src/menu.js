
const sidebarMenu = [
  {
    key: 'index',  
    name: 'Trade',  
    icon: 'smile',  
  },
  {
    key: 'alone',
    name: 'Home',
    icon: 'clock-circle',
    child: [
      {
        key: 'option1',
        name: 'Market',
        icon: 'play-circle',
      },
      {
        key: 'option2',
        name: 'Prediction',
        icon: 'android',
      },
      {
        key: 'option3',
        name: 'Hold',
        icon: 'bulb',
      },
    ],
  },
];

export default sidebarMenu;


export const headerMenu = [
  {
    key: 'userMenu',
    child: [
      {
        key: 'modifyUser',
        name: 'profile',
        icon: 'bulb',
        url: 'http://jxy.me',
      },
      {
        key: 'user222',
        name: 'help',
        icon: 'rocket',
      },
    ],
  },
  {
    key: 'headerMenu3',
    name: 'News',
    icon: 'setting',
  },
];
