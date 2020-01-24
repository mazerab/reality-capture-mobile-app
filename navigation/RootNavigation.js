import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal'
      }
    })
  }
);

const AppContainer = createAppContainer(RootStackNavigator);

export default AppContainer;