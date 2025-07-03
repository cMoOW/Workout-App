import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
          },
          default: {
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.gray200,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={24} 
              name={focused ? 'home' : 'home'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={24} 
              name={focused ? 'bar-chart' : 'bar-chart-o'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={24} 
              name={focused ? 'leaf' : 'leaf'} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              size={24} 
              name={focused ? 'user' : 'user-o'} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}