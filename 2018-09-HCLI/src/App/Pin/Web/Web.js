import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React       from   'react';
import { WebView } from   'react-native';
import styles      from   './style.js';

/* ウェブ */
export default class WebScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = { website: this.props.navigation.state.params.website };
  }

  /* 表示 */
  render(){
    return(
      <View style={{flex:1}}>
        {(!this.state.website) ?
          <Text>Webページが登録されていません</Text>:
          <WebView
            source={{uri: this.state.website}}
            style={{marginTop: 20}}
          />
        }
      </View>
    );
  }
}
