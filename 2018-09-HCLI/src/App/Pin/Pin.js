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
import Entypo                   from  '../../../node_modules/react-native-vector-icons/Entypo.js';
import { List, ListItem }       from  'react-native-elements';
import RNGooglePlaces           from  'react-native-google-places';
import DatePicker               from  'react-native-datepicker';
import { TextField }            from  'react-native-material-textfield';
import { SwipeListView }        from  'react-native-swipe-list-view';
import styles                   from  './style.js';
import AddScreen                from  './Add/Add.js';
import WebScreen                from  './Web/Web.js';

/* 題名の表示 */
const TitleScreen  = ({ navigation, screenProps }) => (
  <View style={{flex:1, backgroundColor: '#ffffff'}}>
    { (screenProps.places_number != 0) &&
      <List>
      <SwipeListView
        useFlatList
        data={screenProps.places}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                navigation.navigate('Place', { ...item, index: index })
              }}>
              <Text style={{backgroundColor: 'lightgray', fontSize: 20}}>{item.title}</Text>
              { (item.address) ?
                <Text style={{backgroundColor: '#7BEFF2',}}>{item.address}</Text>:
                <Text style={{backgroundColor: '#7BEFF2',}}>住所が登録されていません</Text>
              }
            </TouchableOpacity>
          </View>
        )}
        renderHiddenItem={({ item, index }) => (
          <View style={{backgroundColor: 'red', left: 340, height: 50, justifyContent: 'center',}}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '注意!!',
                  'この項目を削除しますか?',[{
                      text: '削除',
                      onPress: () => {
                        screenProps.removePlacesItem(index);
                        navigation.goBack();
                      },},
                    { text: 'Cancel' },],
                );
              }}>
              <Text style={{left: 10}}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
        disableRightSwipe={true}
        closeOnRowOpen={true}
        recalculateHiddenLayout={true}
        rightOpenValue={-70}
        keyExtractor={item => item.day}
      />
      </List>
    }
    { (screenProps.places_number == 0) &&
      <Text>行きたい場所が登録されていません</Text>}
  </View>
);
/* 項目の追加 */
TitleScreen.navigationOptions = ({ navigation, screenProps }) => ({
  headerRight: (
    <TouchableOpacity
      style={{ marginRight: 8 }}
      onPress={() => navigation.navigate('Add', {
        latitudeDelta:  screenProps.latitudeDelta,
        longitudeDelta: screenProps.longitudeDelta,
      })}>
      <Entypo name='add-to-list' size={24} color={'red'} />
    </TouchableOpacity>
  ),
});

/* 住所の表示 */
class PlaceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:       this.props.navigation.state.params.index,
      title:       this.props.navigation.state.params.title,
      day:         this.props.navigation.state.params.day,
      memo:        this.props.navigation.state.params.memo,
      PlaceID:     this.props.navigation.state.params.PlaceID,
      website:     this.props.navigation.state.params.website,
      phoneNumber: this.props.navigation.state.params.phoneNumber,
      address:     this.props.navigation.state.params.address,
      name:        this.props.navigation.state.params.name,
      types:       this.props.navigation.state.params.types,
      region: {
        latitude:       this.props.navigation.state.params.region.latitude,
        longitude:      this.props.navigation.state.params.region.longitude,
        latitudeDelta:  this.props.navigation.state.params.region.latitudeDelta,
        longitudeDelta: this.props.navigation.state.params.region.longitudeDelta,
      }};
    this.change      = this.change.bind(this);
    this.Replication = this.Replication.bind(this);
  }
  /* 変更 */
  change() {
    const { index, title, day, memo, PlaceID, website, phoneNumber, address, name, types, region } = this.state;
    if (!title) return Alert.alert('Error', 'titleは必須です');

    if(!name){
      this.props.screenProps.changePlacesItem({ index, title, day, memo, PlaceID: '' , website: '', phoneNumber: '', address: '', name: '', types: [ '', '' ], region: '' });
    }
    else{
      this.props.screenProps.changePlacesItem({ index, title, day, memo, PlaceID, website, phoneNumber, address, name, types, region });
    }
    Alert.alert(
      'Notice',
      '項目を変更しました!',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
    );
    this.props.navigation.goBack();
    this.setState({ index: '', title: '', day: '', memo: '', PlaceID: '' , website: '', phoneNumber: '', address: '', name: '', types: [ '', '' ], region: '' });
  }
  /* 複製 */
  Replication(){
    const { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region } = this.state;
    if (!title) return Alert.alert('Error', 'titleは必須です');

    this.props.screenProps.addNewPlacesItem({ title, day, memo, PlaceID, website, phoneNumber, address, name, types, region });
    Alert.alert(
      'Notice',
      '項目を複製しました!',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
    );
    this.props.navigation.goBack();
    this.setState({ title: '', day: '', memo: '', PlaceID: '' , website: '', phoneNumber: '', address: '', name: '', types: [ '', '' ], region: '' });
  }
  /* 場所検索 */
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal({country: 'JP',})
    .then((place) => {
		    this.setState({
          PlaceID:          place.PlaceID,
          website:          place.website,
          phoneNumber:      place.phoneNumber,
          address:          place.address,
          name:             place.name,
          types:          [ place.types ],
          region: {
            latitude:       place.latitude,
            longitude:      place.longitude,
            latitudeDelta:  this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          }});
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }
  /* 表示 */
  render(){
    return(
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
                showIcon={false}
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
                onPress={this.change}>
                <Text style={styles.paragraph}>変更</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={this.Replication}>
                <Text style={styles.paragraph}>複製</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Web', this.props.navigation.state.params)}>
                <Text style={styles.paragraph}>Web</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
/* 項目の削除 */
PlaceScreen.navigationOptions = ({ navigation, screenProps }) => ({
  headerRight: (
    <TouchableOpacity
      style={{ marginRight: 8 }}
      onPress={() => {
        Alert.alert(
          '注意!!',
          'この項目を削除しますか?',[{
              text: '削除',
              onPress: () => {
                screenProps.removePlacesItem(navigation.state.params.index);
                navigation.goBack();
              },},
            { text: 'Cancel' },],
        );
      }}>
      <Entypo name='trash' size={24} color={'red'} />
    </TouchableOpacity>
  ),
});

/* タブの作成 */
export default PinsScreen = createStackNavigator({
  Title: {
    screen: TitleScreen,
    navigationOptions: {
      title: '登録した場所',
    },
  },
  Place: {
    screen: PlaceScreen,
    navigationOptions: {
      title: '詳細',
    },
  },
  Add: {
    screen: AddScreen,
    navigationOptions: {
      title: '追加',
    },
  },
  Web: {
    screen: WebScreen,
    navigationOptions: {
      title: 'ウェブ',
    },
  },
}, {
  initialRouteName: 'Title',
});
