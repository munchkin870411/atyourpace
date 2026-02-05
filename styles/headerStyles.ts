import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#035f11',
    backgroundColor: '#178a2ec6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 350,
    height: 80,
    resizeMode: 'contain',
  },
  profileIcon: {
    fontSize: 28,
  },
});
