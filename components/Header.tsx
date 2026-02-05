import React from 'react';
import { View, Text, Image, Platform, StatusBar } from 'react-native';
import { headerStyles as styles } from '../styles/headerStyles';

export default function Header() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
  
  return (
    <View style={[styles.header, { paddingTop: statusBarHeight }]}>
      <View style={styles.headerLeft}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logoImage}
        />
      </View>
      <Text style={styles.profileIcon}>👤</Text>
    </View>
  );
}
