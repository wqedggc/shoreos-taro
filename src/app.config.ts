export default defineAppConfig({
  pages: [
    'pages/dashboard/index',
    'pages/body/index',
    'pages/profile/index',
    'modules/fire/pages/calculator/index',
    'modules/fire/pages/result/index',
    'modules/body/pages/record/index',
    'modules/body/pages/import/index',
  ],
  window: {
    navigationBarTitleText: 'ShoreOS',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f2f2f7',
  },
  tabBar: {
    color: '#8e8e93',
    selectedColor: '#007aff',
    backgroundColor: '#f9f9f9',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/dashboard/index', text: '首页' },
      { pagePath: 'pages/body/index', text: '体重' },
      { pagePath: 'pages/profile/index', text: '我的' },
    ],
  },
});
