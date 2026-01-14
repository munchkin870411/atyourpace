import React from 'react';
import { View, Text, Image } from 'react-native';
import { headerStyles as styles } from '../styles/headerStyles';

export default function Header() {
  return (
    <View style={styles.header}>
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
