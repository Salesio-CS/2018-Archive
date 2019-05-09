import { StyleSheet } from 'react-native';
/* スタイル */
export default StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  paragraph: {
    fontSize: 18,
    color: '#737373',
  },
  buttoncontainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 2,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
});
