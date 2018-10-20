import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, ScrollView, TextInput, Alert, Image, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import {earthquakeBeforeList, earthquakeDuringList, earthquakeAfterList,
volcanoDuringList, volcanoProtectFromAsh, volcanoCanDo,
stormCanDo, stormDoAfter, stormDoBefore, stormDoDuring,
typhoonAfter, typhoonBefore, typhoonDuring} from './data.js';
import SendSMS from 'react-native-sms';
import {Item, SimpleItem} from './item.js';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const _style = this.props.selected ? styles.itemSel : styles.item;
    return (
      <TouchableOpacity style={_style} onPress={this._onPress}>
        <View>
          <Text>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

class EmergencyScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const title = navigation.getParam('title');

    this.state = {text: '', numbers: [], title: title,
    latitude: '',
    longitude: '',
    error: ''};
  }

  componentDidMount() {
    AsyncStorage.getItem("emergencycontacts").then((value) => {
      if (value) {
        value = JSON.parse(value);
        value = value.filter((el) => {
          return el != null;
        });
        this.setState({numbers: value});
        console.log(this.state.numbers);
      }
    }).done();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        // Alert.alert("Got location");
      },
      (error) => {this.setState({ error: error.message });
        Alert.alert(error.message);
      },
      (error) => {this.setState({ error: error.message });
        // Alert.alert(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Emergency',
    };
  };

  render() {
    let items = this.state.numbers.map((val, key) => {
      if (val) {
        return <SimpleItem key={key} keyval={key} val={val}
          deleteMethod={ () => this.deleteItem(key) }/>
      }
    });

    let length = this.state.numbers.filter(function(value) { return value !== null }).length;

    return (
      <View style={{flex: 1}}>
        <TextInput
          style={{height: 40}}
          placeholder="Add..."
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          onSubmitEditing={this.addNumber.bind(this)}
          style={styles.textinput}
          blurOnSubmit={false}
        />
        <Text style={styles.bagScreenNote}>Long press on numbers to delete.</Text>
        <Text style={styles.bagScreenNote}>Make sure to enable location services for this app from settings.</Text>
        <ScrollView style={styles.bagView}>
          <TouchableOpacity
            disabled={length > 0 ? false : true}
            onPress={this.deleteAll.bind(this)} style={styles.clearAll}>
            <Text style={length > 0 ? styles.clearAllText : styles.clearAllTextDisabled }>Clear All</Text>
          </TouchableOpacity>
          {items}
        </ScrollView>
        <TouchableOpacity style={styles.emergencyButton} onPress={this.send.bind(this)}>
          <Text style={styles.emergencyContent}>Send Messages Now</Text>
        </TouchableOpacity>
      </View>

    );
  }

  saveData() {
     AsyncStorage.setItem("emergencycontacts", JSON.stringify(this.state.numbers));
  }

  deleteAll() {
    Alert.alert(
      'Delete All',
      'Are you sure to remove all items?',
      [
        {text: 'Yes', onPress: () => {
          this.state.numbers = [];
          this.setState({ numbers: this.state.numbers });
          this.saveData();
        }, style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }


  addNumber() {
    if (this.state.text) {
      this.state.numbers.push(this.state.text);
      this.setState({numbers: this.state.numbers});
      this.setState({text: ''});
      this.saveData();
    }
  }

  deleteItem(key) {
    Alert.alert(
      'Delete item',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => {
          console.log(this.state.numbers);
          this.state.numbers.splice(key, 1);
          this.setState({ numbers: this.state.numbers });
          this.saveData();
        }, style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  send() {
    const numbers = this.state.numbers;

    SendSMS.send({
      body: `I'm in danger, ${this.state.title} is happening.\n${this.state.latitude}-${this.state.longitude}`,
      recipients: [...numbers],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true
    }, (completed, cancelled, error) => {
      // console.log(this.state.numbers);
      // Alert.alert('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
    });
  }

}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Disasters',
    headerStyle: {display: 'none'}
  };

  render() {
    return (
      <View style={styles.topView}>
        <View style={styles.secondaryView}>
          <Text style={styles.appName}>NatureAlert</Text>
          <FlatList style={styles.list}
            data={[{key:'Earthquake 🏠'}, {key: 'Volcano 🌋'}, {key: 'Storm 🌪'}, {key: 'Typhoon 🌀'}]}
            renderItem={({item}) => <TouchableOpacity onPress={ () => {
              this.props.navigation.navigate('Details', { title: item.key.split(' ')[0] })}}
              style={styles.mainButton}>
              <Text style={styles.buttonContent}>{item.key}</Text>
            </TouchableOpacity>}
          />
          <Text style={styles.dummies}>The 4 Dummies – NASA SPACE APPS '18</Text>
        </View>
      </View>
    );
  }
}

class BagScreen extends React.Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const title = navigation.getParam('title');

    this.state = {text: '', tasks: [], title: title};
  }

  componentDidMount() {
    AsyncStorage.getItem(`${this.state.title}-items`).then((value) => {
      if (value) {
        value = JSON.parse(value);
        value = value.filter((el) => {
          return el != null;
        });
        this.setState({tasks: value});
      }
    }).done();
  }

  saveData() {
     AsyncStorage.setItem(`${this.state.title}-items`, JSON.stringify(this.state.tasks));
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Bag',
    };
  };

  render() {
    const { navigation } = this.props;
    const title = navigation.getParam('title');

    let items = this.state.tasks.map((val, key) => {
      if (val) {
        return <Item key={key} keyval={key} val={val}
          deleteMethod={ () => this.deleteItem(key) }/>
      }
    });

    let length = this.state.tasks.filter(function(value) { return value !== null }).length;

    return (
      <View style={{flexShrink: 1, flex: 1}}>
        <TextInput
          style={{height: 40}}
          placeholder="Add..."
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          onSubmitEditing={this.addItem.bind(this)}
          style={styles.textinput}
          blurOnSubmit={false}
        />
        <Text style={styles.bagScreenNote}>Press on items to mark as done.</Text>
        <Text style={styles.bagScreenNote}>Long press on items to delete.</Text>
        <Text style={styles.bagScreenNote}>{`${this.state.title} bag: ${length}`}</Text>
        <ScrollView style={styles.bagView}>
          <TouchableOpacity
            disabled={length > 0 ? false : true}
            onPress={this.deleteAll.bind(this)} style={styles.clearAll}>
            <Text style={length > 0 ? styles.clearAllText : styles.clearAllTextDisabled }>Clear All</Text>
          </TouchableOpacity>
          {items}
        </ScrollView>

      </View>
    );
  }

  deleteAll() {
    Alert.alert(
      'Delete All',
      'Are you sure to remove all items?',
      [
        {text: 'Yes', onPress: () => {
          this.state.tasks = [];
          this.setState({ tasks: this.state.tasks });
          this.saveData();
        }, style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }


  addItem() {
    if (this.state.text) {
      this.state.tasks.push(this.state.text);
      this.setState({tasks: this.state.tasks});
      this.setState({text: ''});
      this.saveData();
    }
  }

  deleteItem(key) {
    Alert.alert(
      'Delete item',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => {
          this.state.tasks[key] = null;
          this.setState({ tasks: this.state.tasks });
          this.saveData();
        }, style: 'destructive'},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
      { cancelable: false }
    )
  }
}


class StepsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Precautions',
    };
  };

  renderDisasters(param) {
    switch (param) {
      case "Earthquake":
      return <ScrollView style={styles.container}>
        <Image style={styles.images} source={require('./img/quake.jpg')} />
        <Text style={styles.title}>Before an Earthquake:</Text>
        <Text style={styles.PrecautionScreenNote}>Press on items to mark as done.</Text>

        <Text style={styles.subTitle}>Make sure to have:</Text>
        <MultiSelectList data={earthquakeBeforeList}></MultiSelectList>

        <Text style={styles.title}>During an Earthquake:</Text>
        <MultiSelectList data={earthquakeDuringList}></MultiSelectList>

        <Text style={styles.title}>After an Earthquake:</Text>
        <MultiSelectList data={earthquakeAfterList}></MultiSelectList>

      </ScrollView>;

    case "Volcano":
    return <ScrollView style={styles.container}>
      <Image style={styles.images} source={require('./img/volcano.jpg')} />
      <Text style={styles.title}>A Volcano can cause:</Text>
      <Text style={styles.PrecautionScreenNote}>Press on items to mark as done.</Text>
      <MultiSelectList data={volcanoCanDo}></MultiSelectList>

      <Image style={styles.images} source={require('./img/volcano2.jpg')} />
      <Text style={styles.title}>During a Volcanic Eruption:</Text>
      <MultiSelectList data={volcanoDuringList}></MultiSelectList>

      <Image style={styles.images} source={require('./img/volcanoash.jpg')} />
      <Text style={styles.title}>Protection from falling Ash:</Text>
      <MultiSelectList data={volcanoProtectFromAsh}></MultiSelectList>

    </ScrollView>;

    case "Storm":
    return <ScrollView style={styles.container}>
      <Image style={styles.images} source={require('./img/storm.jpg')} />
      <Text style={styles.title}>A Storm can cause:</Text>
      <Text style={styles.PrecautionScreenNote}>Press on items to mark as done.</Text>
      <MultiSelectList data={stormCanDo}></MultiSelectList>

      <Image style={styles.images} source={require('./img/beforestorm.jpg')} />
      <Text style={styles.title}>Before a Storm:</Text>
      <MultiSelectList data={stormDoBefore}></MultiSelectList>

      <Text style={styles.title}>During a Storm:</Text>
      <MultiSelectList data={stormDoDuring}></MultiSelectList>

      <Image style={styles.images} source={require('./img/afterstorm.jpg')} />
      <Text style={styles.title}>After a Storm:</Text>
      <MultiSelectList data={stormDoAfter}></MultiSelectList>

    </ScrollView>;

    case "Typhoon":
    return <ScrollView style={styles.container}>
      <Image style={styles.images} source={require('./img/typhoon.jpg')} />
      <Text style={styles.title}>Before a Typhoon:</Text>
      <Text style={styles.PrecautionScreenNote}>Press on items to mark as done.</Text>
      <MultiSelectList data={typhoonBefore}></MultiSelectList>

      <Text style={styles.title}>During a Typhoon:</Text>
      <MultiSelectList data={typhoonDuring}></MultiSelectList>

      <Text style={styles.title}>After a Typhoon:</Text>
      <MultiSelectList data={typhoonAfter}></MultiSelectList>

    </ScrollView>;

    default:
    return <Text>{param}</Text>;
  }
}

  render() {
    const { navigation } = this.props;
    const title = navigation.getParam('title');

    return (
      <View>
        {this.renderDisasters(title)}
      </View>
    );
  }
}

const DisastersStack = createBottomTabNavigator(
  {
    Steps: StepsScreen,
    Bag: BagScreen,
    Emergency: EmergencyScreen
  },
  {
    initialRouteName: 'Steps',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Steps') {
          return <Text>📋</Text>;
        } else if (routeName === 'Bag') {
          return <Text>🎒</Text>;
        } else if (routeName === 'Emergency') {
          return <Text>‼️</Text>;
        }
      },
    }),
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DisastersStack,
  },
  {
    initialRouteName: 'Home',
  }
);


export default class App extends React.Component {
  render() {
    return <RootStack persistenceKey={'navState'}/>;
  }
}


const styles = StyleSheet.create({
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 'auto',
    color: '#66BB6A',
    marginBottom: 50
  },
  dummies: {
    marginBottom: 3,
    fontSize: 10
  },
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  bagView: {
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // height: '70%' Remove with removing flexShrink
  },
  topView: {
    backgroundColor: 'white',
    height: '100%'
  },
  secondaryView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    // marginTop: 'auto',
    marginBottom: 'auto',
    flexGrow: 0,
    width: '100%',
  },
  item: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7E9',
    borderRadius: 3,
    backgroundColor: 'white',
    fontSize: 16,
  },
  itemSel: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    color: '#BDC3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7E9',
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 15,
    color: '#212121',
    fontWeight: 'bold'
  },
  mainButton: {
    padding: 10,
    backgroundColor: '#F7F9F9',
    fontSize: 15,
    margin: 5,
    borderRadius: 3,
    textAlign: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 50,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    textAlign: 'center',
    fontSize: 17
  },
  textinput: {
    backgroundColor: 'white',
    margin: 10,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 5,
    height: 35
  },
  bagScreenNote: {
    fontSize: 12,
    color: 'grey',
    paddingLeft: 6,
    marginBottom: 10
  },
  PrecautionScreenNote: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 10
  },
  clearAll: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7E9',
    borderRadius: 3,
  },
  clearAllText: {
    color: 'red',
    textAlign: 'right',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  clearAllTextDisabled: {
    color: 'grey',
    textAlign: 'right',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  emergencyButton: {
    padding: 10,
    backgroundColor: 'red',
    fontSize: 15,
    margin: 5,
    borderRadius: 3,
    textAlign: 'center',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 50,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyContent: {
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
    fontWeight: '600'
  },
  images: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '100%',
    height: 200,
    borderRadius: 3
  }
});
