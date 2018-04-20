import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import ImageScreen from '../screens/ImageScreen';
import ViewerScreen from '../screens/ViewerScreen';

export default TabNavigator(
    {
        Images: {
            screen: ImageScreen,
        },
        ForgeViewer: {
            screen: ViewerScreen,
        },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                case 'Images':
                    iconName =
                    Platform.OS === 'ios'
                        ? `ios-camera${focused ? '' : '-outline'}`
                        : 'md-camera';
                    break;
                case 'ForgeViewer':
                    iconName = Platform.OS === 'ios' ? `ios-cloud-done${focused ? '' : '-outline'}` : 'md-cloud-done';
                    break;
                }
                return (
                    <Ionicons
                        name={iconName}
                        size={28}
                        style={{ marginBottom: -3 }}
                        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                    />
                );
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
    }
);
