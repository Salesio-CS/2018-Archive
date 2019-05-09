import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React                                          from 'react';
import { createStackNavigator }                       from 'react-navigation';
import Entypo                                         from '../../../node_modules/react-native-vector-icons/Entypo.js';
import { List, ListItem }                             from 'react-native-elements';
import MapView, { Callout, Marker, ProviderPropType } from 'react-native-maps';
import MapViewDirections                              from 'react-native-maps-directions';
import RNGooglePlaces                                 from 'react-native-google-places';
import DatePicker                                     from 'react-native-datepicker';
import { TextField }                                  from 'react-native-material-textfield';
import styles                                         from './style.js';

const mode = '徒歩';
var   Poi  = {
  name:     '',
  placeId:  '',
  position: {
    y: null,
    x: null,
  },
  coordinate:{
    latitude:  null,
    longitude: null,
  },
};

const { width, height } = Dimensions.get('window');
var   Anime = {
  heightAtInvisible:  null,
  heightAtDisplay:    null,
  flag:               false,
};

console.disableYellowBox = true;

class Add extends React.Component {
  /* 文字の追加 */
  constructor(props) {
    super(props);
    this.state = {
      title:        '' ,
      day:          '',
      memo:         '',
      PlaceID:      this.props.navigation.state.params.PlaceID,
      website:      '',
      phoneNumber:  '',
      address:      this.props.navigation.state.params.address,
      name:         this.props.navigation.state.params.name,
      types:        this.props.navigation.state.params.types,
      region: {
        latitude:       this.props.navigation.state.params.region.latitude,
        longitude:      this.props.navigation.state.params.region.longitude,
        latitudeDelta:  this.props.navigation.state.params.latitudeDelta,
        longitudeDelta: this.props.navigation.state.params.longitudeDelta,
      }};
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
      [{ text: 'OK', onPress: () => {
        this.props.navigation.goBack();
        Poi = {
          name:     '',
          placeId:  '',
          position: {
            y: null,
            x: null,
          },
          coordinate:{
            latitude:  null,
            longitude: null,
          },
        };
      }}],
    );
    this.props.navigation.goBack();
    this.setState({ title: '', day: '', memo: '', PlaceID: '' , website: '', phoneNumber: '', address: '', name: '', types: [ '', '' ], region: '' });
  }
  /* 行きたい場所 */
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
/* Mapの表示 */
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onPoiClick = this.onPoiClick.bind(this);
  }
  /* Poi */
  onPoiClick(e) {
    Poi = e.nativeEvent;
    this.props.screenProps.update();
  }

  /* 詳細が押されたとき */
  _onPress = () => {
    LayoutAnimation.spring();
    if(!Anime.flag){
      if(this.props.screenProps.Current){
        Anime.heightAtInvisible = -55;
        Anime.heightAtDisplay   = height - 370;
      }
      else{
        Anime.heightAtInvisible = -84;
        Anime.heightAtDisplay   = height - 312;
      }
      Anime.flag   = !Anime.flag;
    }
    else{
      Anime.heightAtDisplay    = height - 178;
      Anime.flag   = !Anime.flag;
    }
    console.log(Anime.heightAtDisplay, Anime.heightAtInvisible);
    this.props.screenProps.update();
  }
  /* ルート検索が押されたとき */
  _onPress1 = () => {
    LayoutAnimation.spring();
    if(!this.props.screenProps.Current){
      Anime.heightAtInvisible = -55;
      Anime.heightAtDisplay   = height - 595;
    }
    else{
      Anime.heightAtInvisible = -84;
      Anime.heightAtDisplay   = height - 312;
    }
    Anime.heightAtDisplay     = height - 178;
    Anime.flag   = !Anime.flag;
    console.log(Anime.heightAtDisplay, Anime.heightAtInvisible);
    this.props.screenProps.update();
  }

  render(){
    /* Poiの表示 */
    var Poi_ = [];
    if(Poi.coordinate.latitude){
      var Poi_flag = 0;
      Poi_.push(
        <Marker
          coordinate ={Poi.coordinate}
          pinColor={"yellow"}
          onDragStart={(e)=> Poi_flag = e.nativeEvent}
          onDragEnd  ={(e)=>
            {(() => {
              if(Poi_flag != e.nativeEvent){
                Poi.coordinate = e.nativeEvent.coordinate;
                Poi.name='';
              }
            })()}
          }
          draggable>
          <Callout>
            <View>
              <Text>Name: { Poi.name }</Text>
            </View>
          </Callout>
        </Marker>
      )
    }
    /* 初期表示 */
    var Markers = [];
    if(this.props.screenProps.places_number != 0 &&
       this.props.screenProps.number == -1){
      for(let i = 0; i < this.props.screenProps.places_number; i++){
        if(this.props.screenProps.places[i].region.latitude){
          Markers.push(
            <Marker key={i} coordinate={this.props.screenProps.places[i].region}>
              <Callout>
                <View>
                  <Text>{ this.props.screenProps.places[i].title }</Text>
                  <Text>{ this.props.screenProps.places[i].memo  }</Text>
                </View>
              </Callout>
            </Marker>
          )
        }
      }
    }
    /* マーカーの表示 */
    var Markers1 = [];
    if(this.props.screenProps.places_number != 0 && this.props.screenProps.number != -1 && this.props.screenProps.places[this.props.screenProps.number].region.latitude){
      Markers1.push(
        <Marker coordinate={this.props.screenProps.places[this.props.screenProps.number].region}>
          <Callout>
            <View>
              <Text>{ this.props.screenProps.places[this.props.screenProps.number].title }</Text>
              <Text>{ this.props.screenProps.places[this.props.screenProps.number].memo  }</Text>
            </View>
          </Callout>
        </Marker>
      )
    }
    /* 現在地の表示 */
    var Markers2 = [];
    if(this.props.screenProps.Current){
      Markers2.push(
        <Marker coordinate={this.props.screenProps.region}>
          <Callout>
            <View>
              <Text>現在地</Text>
              <Text>そーなのかー</Text>
            </View>
          </Callout>
        </Marker>
      )
    }
    /* ルートの表示 */
    var Direction = [];
    if(this.props.screenProps.Current && this.props.screenProps.places_number != 0 && this.props.screenProps.places[this.props.screenProps.number].region.latitude && this.props.screenProps.number != -1){
        Direction.push(
         <MapViewDirections
           origin={{latitude:this.props.screenProps.region.latitude, longitude:this.props.screenProps.region.longitude}}
           destination={{latitude:this.props.screenProps.places[this.props.screenProps.number].region.latitude, longitude:this.props.screenProps.places[this.props.screenProps.number].region.longitude}}
           apikey='AIzaSyCEojpnoh7MpZKznrr2cX6wZqImNhcA5mM'
           language='jp'
           mode='walking'
           strokeWidth={1}
           strokeColor='red'
         />
       )
    }
    /* 詳細の表示 */
    var Details = [];
    if(this.props.screenProps.number != -1){
      Details.push(
        <View style={[
          styles.container, {
            top:    Anime.heightAtDisplay,
            width:  420,
            height: 350,
          }
        ]}>
          <View style={{top: Anime.heightAtInvisible}}>
            <TouchableOpacity onPress={this._onPress}>
              <View style={styles.button1}>
                <Text style={{color: '#fff', fontWeight: 'bold',}}>詳細</Text>
              </View>
            </TouchableOpacity>
            <View style={{backgroundColor: '#87CEEB'}}>
              { (this.props.screenProps.places_number != 0 && this.props.screenProps.number != -1)    &&
                <Text>題名　　　　　{this.props.screenProps.places[this.props.screenProps.number].title}  </Text>}
              { (this.props.screenProps.Current       == true) &&
                <View>
                  <Text>ルート　　　　{mode}                             </Text>
                  <Text>距離　　　　　{this.props.screenProps.distance}  </Text>
                  <Text>所要時間　　　{this.props.screenProps.duration}  </Text>
                </View>
              }
              { (this.props.screenProps.places_number != 0 && this.props.screenProps.number != -1)    &&
                <View>
                  <Text>行きたい場所　{this.props.screenProps.places[this.props.screenProps.number].name}   </Text>
                  <Text>日付　　　　　{this.props.screenProps.places[this.props.screenProps.number].day}    </Text>
                  <Text>メモ　　　　　{this.props.screenProps.places[this.props.screenProps.number].memo}   </Text>
                </View>
              }
              <View style={styles.buttoncontainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if(!this.props.screenProps.Current){
                      this.props.screenProps.moveCurrentPlace();
                    }
                    else{
                      this.props.screenProps.movePlace(this.props.screenProps.number);
                    }
                    this._onPress1();
                    Poi = {
                      name:     '',
                      placeId:  '',
                      position: {
                        y: null,
                        x: null,
                      },
                      coordinate:{
                        latitude:  null,
                        longitude: null,
                      },
                    };
                  }}>
                  <Text style={styles.paragraph}>ルート検索</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    }

    return(
      <View style={{flex:1}}>
        <MapView
          style={{flex:1}}
          region={this.props.screenProps.c_region}
          onRegionChangeComplete={(region) =>{ this.props.screenProps.moveC_region(region);}}
          onPoiClick={this.onPoiClick}>
          { Poi_      }
          { Markers   }
          { Markers1  }
          { Markers2  }
          { Direction }
        </MapView>
        { Details }
      </View>
    );
  }
}
Map.navigationOptions = ({ navigation, screenProps }) => ({
  headerRight: (
    <TouchableOpacity
      style={{ marginRight: 8 }}
      onPress={() =>
        {(() => {
          if(Poi.coordinate.latitude){
            fetch('https://maps.googleapis.com/maps/api/geocode/json' +
                  '?latlng='    + Poi.coordinate.latitude  + ','
                                + Poi.coordinate.longitude +
                  '&language='  + 'ja' +
                  '&key=AIzaSyCEojpnoh7MpZKznrr2cX6wZqImNhcA5mM')
            .then((response) => response.json())
            .then((jsonData) => {
              navigation.navigate('Add', {
                PlaceID:        jsonData.results[0].place_id,
                address:        jsonData.results[0].formatted_address,
                name:           Poi.name,
                types:          jsonData.results[0].types,
                region:         Poi.coordinate,
                latitudeDelta:  screenProps.latitudeDelta,
                longitudeDelta: screenProps.longitudeDelta,
              });
            });
          }
          else{
            Poi = {
              coordinate:{
                latitude:  screenProps.c_region.latitude,
                longitude: screenProps.c_region.longitude,
              },
            }
            /* 強制レンダリング */
            screenProps.update();
          }
        })()}}>
      <Entypo name="add-to-list" size={24} color={'red'} />
    </TouchableOpacity>
  ),
  headerLeft: (
    <TouchableOpacity
      style={{ marginLeft: 8 }}
      onPress={() => navigation.navigate('Pin')}>
      <Entypo name="flag" size={24} color={'red'} />
    </TouchableOpacity>
  ),
});

/* ピンの表示 */
const Pin = ({ navigation, screenProps }) => (
  <View style={{flex:1, backgroundColor: '#ffffff'}}>
    { (screenProps.places_number != 0) &&
      <List>
        <FlatList
          data={screenProps.places}
          renderItem={({ item, index }) => (
            <ListItem
              roundAvatar
              title={item.title}
              subtitle={item.address}
              onPress={() =>
                {(() => {
                  {(!item.region.latitude) ?
                    Alert.alert('Warning','住所が登録されていません',):
                    screenProps.movePlace(index)
                  }
                  Poi = {
                    name:     '',
                    placeId:  '',
                    position: {
                      y: null,
                      x: null,
                    },
                    coordinate:{
                      latitude:  null,
                      longitude: null,
                    },
                  };
                  Anime= {
                    heightAtDisplay:   height - 178,
                    heightAtInvisible: -84,
                    flag: false,
                  };
                  navigation.goBack()
                })()}}/>)}
          keyExtractor={item => item.day}
        />
      </List>
    }
    { (screenProps.places_number == 0) &&
      <Text>行きたい場所が登録されていません</Text>}
  </View>
);

/* タブの作成 */
export default MapScreen = createStackNavigator({
  Map: { screen: Map,
    navigationOptions: {
      title: 'マップ',
    },},
  Pin: { screen: Pin,
    navigationOptions: {
      title: '登録した場所',
    }, },
  Add: { screen: Add,
    navigationOptions: {
      title: '登録',
    }, },
},{
  initialRouteName: 'Map',
});
