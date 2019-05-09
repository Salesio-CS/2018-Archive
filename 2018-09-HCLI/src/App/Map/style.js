import { StyleSheet } from 'react-native';
/* スタイル */
export default StyleSheet.create({
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

  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#FFFF",
    justifyContent: "center",
  },
  button1: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
