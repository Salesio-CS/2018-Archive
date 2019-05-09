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
import React                              from 'react';
import { createStackNavigator }           from 'react-navigation';
import Entypo                             from '../../../node_modules/react-native-vector-icons/Entypo.js';
import RNGooglePlaces                     from 'react-native-google-places';
import DatePicker                         from 'react-native-datepicker';
import { TextField }                      from 'react-native-material-textfield';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig}                     from 'react-native-calendars';
import styles                             from './style.js';
import WebScreen                          from '../Pin/Web/Web.js';

LocaleConfig.locales['fr'] = {
  monthNames:      ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
  dayNames:        ['日','月','火','水','木','金','土'],
  dayNamesShort:   ['日','月','火','水','木','金','土']
};
LocaleConfig.defaultLocale = 'fr';

/* 住所の表示 */
class Place extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:       this.props.navigation.state.params.index,
      title:       this.props.screenProps.places[this.props.navigation.state.params.index].title,
      day:         this.props.screenProps.places[this.props.navigation.state.params.index].day,
      memo:        this.props.screenProps.places[this.props.navigation.state.params.index].memo,
      PlaceID:     this.props.screenProps.places[this.props.navigation.state.params.index].PlaceID,
      website:     this.props.screenProps.places[this.props.navigation.state.params.index].website,
      phoneNumber: this.props.screenProps.places[this.props.navigation.state.params.index].phoneNumber,
      address:     this.props.screenProps.places[this.props.navigation.state.params.index].address,
      name:        this.props.screenProps.places[this.props.navigation.state.params.index].name,
      types:       this.props.screenProps.places[this.props.navigation.state.params.index].types,
      region: {
        latitude:       this.props.screenProps.places[this.props.navigation.state.params.index].region.latitude,
        longitude:      this.props.screenProps.places[this.props.navigation.state.params.index].region.longitude,
        latitudeDelta:  this.props.screenProps.places[this.props.navigation.state.params.index].region.latitudeDelta,
        longitudeDelta: this.props.screenProps.places[this.props.navigation.state.params.index].region.longitudeDelta,
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
            latitudeDelta:  this.props.screenProps.latitudeDelta,
            longitudeDelta: this.props.screenProps.longitudeDelta,
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
Place.navigationOptions = ({ navigation, screenProps }) => ({
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
/* 項目の追加 */
class Add extends React.Component {
  //文字の追加
  constructor(props) {
    super(props);
    this.state = {
      title:        '' ,
      day:          this.props.navigation.state.params.day,
      memo:         '',
      PlaceID:      '' ,
      website:      '',
      phoneNumber:  '',
      address:      '',
      name:         '',
      types:      [ '', '' ],
      region: {
        latitude:       '',
        longitude:      '',
        latitudeDelta:  '',
        longitudeDelta: '',
      },
    };
    this.handleOnPress   = this.handleOnPress.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);
  }
  //追加ボタンを押したとき
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
  //行きたい場所
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
  //表示
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

/* カレンダーの表示 */
class Calendar_ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      day:   1542067200000,
    };
  }

  /* 数値を日付に変更 */
  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  /* カレンダーの更新 */
  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({ items: [] });
      for (let i = -30; i < 30; i++) {
        const time = this.state.day + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        this.state.items[strTime] = [];

        var day_flag = false;
        for(let i = 0; i < this.props.screenProps.places_number; i++){
          if(this.props.screenProps.places[i].day == strTime){
            this.state.items[this.props.screenProps.places[i].day].push({
              index:       i,
              title:       this.props.screenProps.places[i].title,
              day:         this.props.screenProps.places[i].day,
              memo:        this.props.screenProps.places[i].memo,
              PlaceID:     this.props.screenProps.places[i].PlaceID,
              website:     this.props.screenProps.places[i].website,
              phoneNumber: this.props.screenProps.places[i].phoneNumber,
              address:     this.props.screenProps.places[i].address,
              name:        this.props.screenProps.places[i].name,
              types:       this.props.screenProps.places[i].types,
              region:{
                latitude:       this.props.screenProps.places[i].region.latitude,
                longitude:      this.props.screenProps.places[i].region.longitude,
                latitudeDelta:  this.props.screenProps.places[i].region.latitudeDelta,
                longitudeDelta: this.props.screenProps.places[i].region.longitudeDelta,
              }
            });
            day_flag = true;
          }
        }
        if(day_flag == false){
          this.state.items[strTime].push({
            index: -1,
            day:   strTime,
          });
        }
      }

      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 2000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  /* 日にちが押された際にカレンダーをロード */
  loadItems(day) {
    setTimeout(() => {
      this.setState({
        items: [],
        day:   day.timestamp,
      });
      for(let i = 0; i < this.props.screenProps.places_number; i++){
        this.state.items[this.props.screenProps.places[i].day] = [];
        this.state.items[this.props.screenProps.places[i].day].push({
          index:       i,
          title:       this.props.screenProps.places[i].title,
          day:         this.props.screenProps.places[i].day,
          memo:        this.props.screenProps.places[i].memo,
          PlaceID:     this.props.screenProps.places[i].PlaceID,
          website:     this.props.screenProps.places[i].website,
          phoneNumber: this.props.screenProps.places[i].phoneNumber,
          address:     this.props.screenProps.places[i].address,
          name:        this.props.screenProps.places[i].name,
          types:       this.props.screenProps.places[i].types,
          region:{
            latitude:       this.props.screenProps.places[i].latitude,
            longitude:      this.props.screenProps.places[i].longitude,
            latitudeDelta:  this.props.screenProps.places[i].latitudeDelta,
            longitudeDelta: this.props.screenProps.places[i].longitudeDelta,
          }
        });
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 10);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  /* 日付ごとの表示 */
  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <TouchableOpacity
          onPress={() => {
            (item.index != -1) ?
            this.props.navigation.navigate('Place', { ...item }):
            this.props.navigation.navigate('Add', {
              day:            item.day,
              latitudeDelta:  this.props.screenProps.latitudeDelta,
              longitudeDelta: this.props.screenProps.longitudeDelta,
            })
          }}>
          <Text>{(item.index != -1) ? item.title: '登録なし'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            (item.index != -1) ?
            this.props.navigation.navigate('Place', { ...item }):
            this.props.navigation.navigate('Add', {
              day: item.day,
              latitudeDelta:  this.props.screenProps.latitudeDelta,
              longitudeDelta: this.props.screenProps.longitudeDelta,
            })
          }}>
          <Text>{(item.index != -1) ? item.name: ''}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            (item.index != -1) ?
            this.props.navigation.navigate('Place', { ...item }):
            this.props.navigation.navigate('Add', {
              day: item.day,
              latitudeDelta:  this.props.screenProps.latitudeDelta,
              longitudeDelta: this.props.screenProps.longitudeDelta,
            })
          }}>
          <Text>{(item.index != -1) ? item.memo: ''}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            (item.index != -1) ?
            this.props.navigation.navigate('Place', { ...item }):
            this.props.navigation.navigate('Add', {
              day: item.day,
              latitudeDelta:  this.props.screenProps.latitudeDelta,
              longitudeDelta: this.props.screenProps.longitudeDelta,
            })
          }}>
          <Text>{(item.index != -1) ? item.address: ''}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* パフォーマンスの向上 */
  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  /* 表示 */
  render(){
    var Marked = [];
    for(let i = 0; i < this.props.screenProps.places_number; i++){
      if(this.props.screenProps.places[i].day){
        Marked[this.props.screenProps.places[i].day] = [];
        Marked[this.props.screenProps.places[i].day].marked = true;
      }
    }
    return(
      <Agenda
        items={this.state.items}
        monthFormat={'yyyy年 M月'}
        markedDates={Marked}
        onDayPress={this.loadItems.bind(this)}
        selected={'2018-11-12'}
        renderItem={this.renderItem.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        //theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }
}

/* タブの作成 */
export default CalendarScreen = createStackNavigator({
  Calendar_: {
    screen: Calendar_,
    navigationOptions: {
      title: 'カレンダー',
    },
  },
  Place: {
    screen: Place,
    navigationOptions: {
      title: '詳細',
    },
  },
  Add: {
    screen: Add,
    navigationOptions: {
      title: '詳細',
    },
  },
  Web: {
    screen: WebScreen,
    navigationOptions: {
      title: 'ウェブ',
    },
  },
}, {
  initialRouteName: 'Calendar_',
});
