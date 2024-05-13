import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabConfig} from './RouteConfig';
import BottomTab from '../components/BottomTab';
import RouteName from './RouteName';

const Tab = createBottomTabNavigator();

const TabContainer = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouteName.TAB_HOME}
      tabBar={props => <BottomTab {...props} />}>
      {TabConfig.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabContainer;
