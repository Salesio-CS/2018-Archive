import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React                    from  'react';
import { createStackNavigator } from  'react-navigation';
import RNGooglePlaces           from  'react-native-google-places';
import DatePicker               from  'react-native-datepicker';
import { TextField }            from  'react-native-material-textfield';
import styles                   from  './style.js';

/* 項目の追加 */
export default class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:        '' ,
      day:          '',
      memo:         '',
      PlaceID:      '' ,
      website:      '',
      phoneNumber:  '',
      address:      '' ,
      name:         '',
      types:      [ '', '' ],
      region: {
        latitude:       '',
        longitude:      '',
        latitudeDelta:  '',
        longitudeDelta: ''
      }
    };
    this.handleOnPress   = this.handleOnPress.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);
  }
  /* 追加ボタンを押したとき */
  handleOnPress() {
    const { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region } = this.state;
    if (!title) return Alert.alert('Error', 'titleは必須です');

    this.props.screenProps.addNewPlacesItem({ title, day, memo, PlaceID, website, phoneNumber, address, name, types, region });
    Alert.alert(
      'Notice',
      '項目を追加しました!',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
    );
    this.props.navigation.goBack();
    this.setState({ title: '', day: '', memo: '', PlaceID: '' , website: '', phoneNumber: '', address: '', name: '', types: [ '', '' ], region: '' });
  }
  /* 行きたい場所 */
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal({country: 'JP',})
    .then((place) => {
		    this.setState({
          PlaceID:     place.PlaceID,
          website:     place.website,
          phoneNumber: place.phoneNumber,
          address:     place.address,
          name:        place.name,
          types:     [ place.types ],
          region: {
            latitude:       place.latitude,
            longitude:      place.longitude,
            latitudeDelta:  this.props.navigation.state.params.latitudeDelta,
            longitudeDelta: this.props.navigation.state.params.longitudeDelta,
          }});
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }
  /* 表示 */
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1, backgroundColor: '#ffffff'}}>
          <ScrollView>
            <View style={{left:10}}>
              <TextField
                label='Title'
                onChangeText={title => this.setState({ title })}
                value={this.state.title}
              />

              <TextField
                label='行きたい場所'
                onChangeText={name => this.setState({ name })}
                onFocus={() => this.openSearchModal()}
                value={this.state.name}
              />

              <Text>日付</Text>
              <DatePicker
                style=          {{width: 200}}
                date=           {this.state.day}
                mode=           'date'
                placeholder=    '日付を入力してください'
                format=         'YYYY-MM-DD'
                minDate=        '2018-10-16'
                maxDate=        '2019-12-31'
                confirmBtnText= 'Confirm'
                cancelBtnText=  'Cancel'
                customStyles={{
                  dateInput: {
                    marginLeft: 10
                  }
                }}
                showIcon=       {false}
                onDateChange={(day) => {this.setState({day: day})}}
              />

              <TextField
                label='Memo'
                onChangeText={memo => this.setState({ memo })}
                value={this.state.memo}
                multiline={true}
              />
            </View>

            <View style={styles.buttoncontainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleOnPress}>
                <Text style={styles.paragraph}>追加</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
