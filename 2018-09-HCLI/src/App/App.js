import {
   Alert,
   AsyncStorage,
   Button,
   Dimensions,
   FlatList,
   Keyboard,
   PermissionsAndroid,
   Platform,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   TouchableWithoutFeedback,
   View,
 } from 'react-native';
import React                        from  'react';
import { createBottomTabNavigator } from  'react-navigation';
import Entypo                       from  '../../node_modules/react-native-vector-icons/Entypo.js';
import RNGooglePlaces               from  'react-native-google-places';
import BackgroundTimer              from  'react-native-background-timer';
import styles                       from  './style.js';
import MapScreen                    from  './Map/Map.js';
import PinsScreen                   from  './Pin/Pin.js';
import CalendarScreen               from  './Calendar/Calendar.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

/* 初期データ */
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO      = width / height;
const LATITUDE_DELTA    = 0.0922/4;
const LONGITUDE_DELTA   = LATITUDE_DELTA * ASPECT_RATIO;

const Variable ={
  places:         [
    {
      title:       '課題提出' ,
      day:         '2018-11-15',
      memo:        '',
      PlaceID:     '' ,
      website:     'http://www.salesio-sp.ac.jp',
      phoneNumber: '+81 42-775-3020',
      address:     '日本、〒194-0215 東京都町田市小山ヶ丘4丁目6-8',
      name:        'サレジオ高専',
      types:       'schoolpoint_of_interstestablishment',
      region:{
        latitude:       35.605239,
        longitude:      139.35791,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    },
    {
      title:       '郵便物' ,
      day:         '',
      memo:        '',
      PlaceID:     '' ,
      website:     '',
      phoneNumber: '',
      address:     '日本、〒194-0215 東京都町田市小山ヶ丘3丁目23',
      name:        '多摩境',
      types:       'train_stationtransit_stationpoint_of_interestestablishment',
      region:{
        latitude:       35.6019216,
        longitude:      139.36702019999998,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    },
  ],
  Current:        false,
  number:         -1,
  places_number:  2,
  region:         {
    latitude:       35.605239,
    longitude:      139.35791,
    latitudeDelta:  LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  c_region:       {
    latitude:       (35.605239 + 35.6019216) / 2,
    longitude:      (139.35791 + 139.36702019999998) / 2,
    latitudeDelta:  LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  },
  likelihood:     0,
  distance:       '',
  duration:       '',
  place_flag:     false,
  Update:         false,
  latitudeDelta:  LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

/* TabNavigatorを作成 タブアイコンの設定を行っている
 * 第二引数で画面下タブに表示されるアイコン色とラベル非表示を設定 */
const Tab = createBottomTabNavigator({
  Map: {
    screen: MapScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Entypo name='map' size={24} color={ tintColor } />,
    },
  },
  Pins: {
    screen: PinsScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Entypo name='pin' size={24} color={ tintColor } />,
    },
  },
  Calendar: {
    screen: CalendarScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Entypo name='calendar' size={24} color={ tintColor } />,
    },
  },
}, {
  initialRouteName: 'Map',
  tabBarOptions: {
    activeTintColor: '#037aff',
    inactiveTintColor: '#737373',
    style: {
      height: 50,
    },
    //showLabel: false,
  },
});

/* 最初に呼ばれるコンポーネント */
export default class App extends React.Component {
  /* データの取得 */
  async Get(){
    try{
      const result = await AsyncStorage.getItem('results');
      if (result !== null) { // データがあった場合
        var variable = JSON.parse(result);
        var la_l = 0, la_s = 100000, lo_l = 0, lo_s = 100000;
        for(let i = 0; i < variable.number; i++){
          if(variable.places[i].region.latitude){
            if(la_l < variable.places[i].region.latitude){
              la_l = variable.places[i].region.latitude;
            }
            if(variable.places[i].region.latitude < la_s){
              la_s = variable.places[i].region.latitude;
            }
            if(lo_l < variable.places[i].region.longitude){
              lo_l = variable.places[i].region.longitude;
            }
            if(variable.places[i].region.longitude < lo_s){
              lo_s = variable.places[i].region.longitude;
            }
          }
          //console.log(i,la,lo);
        }
        la = (la_l + la_s) / 2; lo = (lo_l + lo_s) / 2;
        //console.log(la,lo);

        var lar = 0, sma = 100000, i_l, i_s;
        for(let i = 0; i < variable.number; i++){
          if(variable.places[i].region.latitude){
            if(lar < Math.sqrt(
              Math.pow(la - variable.places[i].region.latitude,  2) +
              Math.pow(lo - variable.places[i].region.longitude, 2))){
              lar = Math.sqrt(
                Math.pow(la - variable.places[i].region.latitude,  2) +
                Math.pow(lo - variable.places[i].region.longitude, 2));
              i_l = i;
            }
            if(Math.sqrt(
              Math.pow(la - variable.places[i].region.latitude,  2) +
              Math.pow(lo - variable.places[i].region.longitude, 2)) < sma){
                sma = Math.sqrt(
                  Math.pow(la - variable.places[i].region.latitude,  2) +
                  Math.pow(lo - variable.places[i].region.longitude, 2));
                  i_s = i;
              }
          }
        }
        var c_;
        c_ = {
          latitude:       la,
          longitude:      lo,
          latitudeDelta:  ((Math.sqrt(
                            Math.pow(variable.places[i_l].region.latitude  - variable.places[i_s].region.latitude ,2) +
                            Math.pow(variable.places[i_l].region.longitude - variable.places[i_s].region.longitude,2)
                            )) / 0.6),
          longitudeDelta: ((Math.sqrt(
                            Math.pow(variable.places[i_l].region.latitude  - variable.places[i_s].region.latitude ,2) +
                            Math.pow(variable.places[i_l].region.longitude - variable.places[i_s].region.longitude,2)
                            )) / 0.6) * ASPECT_RATIO,
        }
        this.setState({
          places:         variable.places,
          places_number:  variable.number,
          c_region:       c_,
        });
        //console.log(variable.places, variable.number);
      }
      if(variable.flag == null){ // データがなく，初回起動の場合
        this.setState({
          places,
          Current,
          number,
          places_number,
          region,
          c_region,
          likelihood,
          distance,
          duration,
          place_flag,
          Update,
          latitudeDelta,
          longitudeDelta,
        })
      }
    }
    catch(error){ // エラー
      console.log('データの取得に失敗しました．');
    }
  }
  /* データの書き込み */
  async Write({places, number, flag}){
    try {
      await AsyncStorage.setItem('results', JSON.stringify({places, number, flag}));
      //console.log(place, number);
    }
    catch (error) { // 書き込めなかった場合
      console.log('データを書き込めませんでした．');
    }
  }

  constructor(props) {
    super(props);
    this.Get();
    this.state = {
      places:         Variable.places,
      Current:        Variable.Current,
      number:         Variable.number,
      places_number:  Variable.places_number,
      region:         Variable.region,
      c_region:       Variable.c_region,
      likelihood:     Variable.likelihood,
      distance:       Variable.distance,
      duration:       Variable.duration,
      place_flag:     Variable.place_flag,
      Update:         Variable.Update,
      latitudeDelta:  Variable.latitudeDelta,
      longitudeDelta: Variable.longitudeDelta,
    };

    this.update             = this.update.bind(this);
    this.addNewPlacesItem   = this.addNewPlacesItem.bind(this);
    this.removePlacesItem   = this.removePlacesItem.bind(this);
    this.changePlacesItem   = this.changePlacesItem.bind(this);
    this.movePlace          = this.movePlace.bind(this);
    this.moveCurrentPlace   = this.moveCurrentPlace.bind(this);
    this.moveC_region       = this.moveC_region.bind(this);
  }

  /* 定期的に現在地を取得する */
  componentDidMount(){
    const intervalId = BackgroundTimer.setInterval(() => {
      if(this.state.Current){
        this.moveCurrentPlace();
      }
    }, 5000);
  }
  componentWillUnmount() {
    BackgroundTimer.clearInterval(intervalId);
  }

  /* 更新 */
  update(){
    this.setState({
      Update: !this.state.Update,
    });
  }

  /* 追加 */
  addNewPlacesItem({ title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }) {
    this.setState({
      places:         [...this.state.places, { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }],
      places_number:  (this.state.places_number + 1),
      Current:        false,
    });
    if(this.state.places_number == 0 && region.latitude){
      this.setState({
        c_region:     region,
      });
    }
    this.Write({
      places:  [...this.state.places, { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }],
      number:  (this.state.places_number + 1),
      flag:    1,
    });
  }
  /* 削除 */
  removePlacesItem(index) {
    if(index == 0){
      this.setState({
        places:         this.state.places.filter((_, i) => i !== index),
        Current:        false,
        distance:       '',
        number:         0,
      });
      if(this.state.places_number > 0 &&
         this.state.places[this.state.number].region.latitude){
        this.setState({
          c_region:     this.state.places[0].region,
        });
      }
    }
    else {
      this.setState({
        places:         this.state.places.filter((_, i) => i !== index),
        Current:        false,
        distance:       '',
        number:         0,
        c_region:       this.state.places[0].region,
      });
    }
    this.Write({
      places:  this.state.places,
      number:  (this.state.places_number - 1),
      flag:    1,
    });
  }
  /* 変更 */
  changePlacesItem({ index, title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }){
    var copy1 = {};
    var copy2 = {};
    if(0 < index){
      copy1 = this.state.places.slice(0, index);
    }
    if(index < this.state.places_number){
      copy2 = this.state.places.slice(index + 1, this.state.places_number);
    }
    this.setState({
      places: [...copy1, { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }, ...copy2],
      Current:        false,
    });
    if(index == this.state.number && region.latitude){
      this.setState({
        c_region:     region,
      });
    }
    this.Write({
      places: [...copy1, { title, day, memo, PlaceID, website, phoneNumber, address, name, types, region }, ...copy2],
      number: this.state.places_number,
      flag:   1,
    });
  }
  /* 登録した場所 */
  movePlace(index){
    if(this.state.places_number != 0 && this.state.places[index].region.latitude){
      this.setState({
        number:       index,
        c_region:     this.state.places[index].region,
      });
    }
    this.setState({
      Current:        false,
      distance:       '',
    });
  }
  /* 現在地 */
  moveC_region(region){
    this.setState({
      c_region:{
        latitude:       region.latitude,
        longitude:      region.longitude,
        latitudeDelta:  region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }
    });
  }
  async requestLocation() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('現在地を取得しました',);
      } else {
        Alert.alert('現在地を取得できませんでした',);
      }
    } catch (err) {console.warn(err)}
  }
  moveCurrentPlace(){
    if(!this.state.Current){
      this.requestLocation();
    }
    RNGooglePlaces.getCurrentPlace()
    .then((results) => {
      if(!this.state.Current){
        if(this.state.places_number != 0 &&
           this.state.places[this.state.number].region.latitude){
          if(Math.sqrt(Math.pow(results[0].latitude  - this.state.places[this.state.number].region.latitude ,2) +
                    Math.pow(results[0].longitude - this.state.places[this.state.number].region.longitude,2)) /
                    0.6 > LATITUDE_DELTA / 4){
            this.setState({
              c_region: {
                latitude:       (results[0].latitude  + this.state.places[this.state.number].region.latitude)/2,
                longitude:      (results[0].longitude + this.state.places[this.state.number].region.longitude)/2,
                latitudeDelta:  ((Math.sqrt(
                                  Math.pow(results[0].latitude  - this.state.places[this.state.number].region.latitude ,2) +
                                  Math.pow(results[0].longitude - this.state.places[this.state.number].region.longitude,2)
                                  )) / 0.6),
                longitudeDelta: (((Math.sqrt(
                                   Math.pow(results[0].latitude  - this.state.places[this.state.number].region.latitude ,2) +
                                   Math.pow(results[0].longitude - this.state.places[this.state.number].region.longitude,2)
                                 )) / 0.6) * ASPECT_RATIO),
              }});
            }
            else{
              this.setState({
                c_region:{
                  latitude:       (results[0].latitude  + this.state.places[this.state.number].region.latitude)/2,
                  longitude:      (results[0].longitude + this.state.places[this.state.number].region.longitude)/2,
                  latitudeDelta:  LATITUDE_DELTA  / 4,
                  longitudeDelta: LONGITUDE_DELTA / 4,
                }
              });
            }
        }
        if(this.state.places_number == 0 ||
          !this.state.places[this.state.number].region.latitude){
          this.setState({
            c_region: {
              latitude:       results[0].latitude,
              longitude:      results[0].longitude,
              latitudeDelta:  LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          });
        }
      }
      if(this.state.places_number != 0 &&
         this.state.places[this.state.number].region.latitude){
        fetch('https://maps.googleapis.com/maps/api/distancematrix/json' +
              '?units='        + 'metric' +
              '&origins='      + results[0].latitude + ','
                               + results[0].longitude +
              '&destinations=' + this.state.places[this.state.number].region.latitude + ','
                               + this.state.places[this.state.number].region.longitude +
              '&mode='         + 'walking' +
              '&language='     + 'ja' +
              '&key=AIzaSyCEojpnoh7MpZKznrr2cX6wZqImNhcA5mM')
        .then((response) => response.json())
        .then((jsonData) => {
          this.setState({
            distance:  jsonData.rows[0].elements[0].distance.text,
            duration:  jsonData.rows[0].elements[0].duration.text,
          });
          if(jsonData.rows[0].elements[0].distance.value < '100'){
            if(!this.state.place_flag){
              Alert.alert(
                '通知',
                this.state.places[this.state.number].name+'が近くにあります．');
              this.setState({ place_flag: true });
            }
          }
          else{ this.setState({ place_flag: false }); }
        });
      }
      this.setState({
        Current:          true,
        region: {
          latitude:       results[0].latitude,
          longitude:      results[0].longitude,
          latitudeDelta:  LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        likelihood:       results[0].likelihood,
      });
    });
  }

  /* screenPropsで各子供に各値を渡している */
  render() {
    return <Tab screenProps={{
      places:           this.state.places,
      Current:          this.state.Current,
      number:           this.state.number,
      places_number:    this.state.places_number,
      region:           this.state.region,
      c_region:         this.state.c_region,
      likelihood:       this.state.likelihood,
      distance:         this.state.distance,
      duration:         this.state.duration,
      latitudeDelta:    this.state.latitudeDelta,
      longitudeDelta:   this.state.longitudeDelta,

      update:           this.update,
      addNewPlacesItem: this.addNewPlacesItem,
      removePlacesItem: this.removePlacesItem,
      changePlacesItem: this.changePlacesItem,
      movePlace:        this.movePlace,
      moveCurrentPlace: this.moveCurrentPlace,
      moveC_region:     this.moveC_region,
    }} />;
  }
}
