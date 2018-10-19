import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, ScrollView, TextInput, Alert, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import {earthquakeBeforeList, earthquakeDuringList, earthquakeAfterList} from './data.js';

import Item from './item.js';

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
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={_style}>
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


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Disasters',
    headerStyle: {}
  };

  render() {
    return (
      <View style={styles.topView}>
        <View style={styles.secondaryView}>
          <FlatList style={styles.list}
            data={[{key:'Earthquake'}, {key: 'Volcano'}, {key: 'Storm'}, {key: 'Typhoon'}]}
            renderItem={({item}) => <TouchableOpacity onPress={ () => {
              this.props.navigation.navigate('Details', { title: item.key })}}
              style={styles.mainButton}>
              <Text style={styles.buttonContent}>{item.key}</Text>
            </TouchableOpacity>}
          />
        </View>
      </View>
    );
  }
}

class BagScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: '', tasks: []};
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
      return <Item key={key} keyval={key} val={val}
        deleteMethod={ ()=> this.deleteItem(key) }/>
    });

    return (
      <View>
        <TextInput
          style={{height: 40}}
          placeholder="Add..."
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          onSubmitEditing={this.addItem.bind(this)}
          style={styles.textinput}
          blurOnSubmit={false}
        />
        <ScrollView style={styles.container}>
          {items}
        </ScrollView>
      </View>
    );
  }

  addItem() {
    if (this.state.text) {
      this.state.tasks.push(this.state.text);
      this.setState({tasks: this.state.tasks});
      this.setState({text: ''});
    }
  }

  deleteItem(key) {
    this.state.tasks.splice(key, 1);
    this.setState({ tasks: this.state.tasks });
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
        <Text style={styles.title}>Before an Earthquake:</Text>

        <Text style={styles.subTitle}>Make sure to have:</Text>
        <MultiSelectList data={earthquakeBeforeList}></MultiSelectList>

        <Text style={styles.title}>During an Earthquake:</Text>
        <View style={styles.hr}/>
        <MultiSelectList data={earthquakeDuringList}></MultiSelectList>

        <Text style={styles.title}>After an Earthquake:</Text>
        <View style={styles.hr}/>
        <MultiSelectList data={earthquakeAfterList}></MultiSelectList>

      </ScrollView>;

    case "Volcano":
    return <Text>Volcano</Text>;

    case "Storm":
    return <Text>storm</Text>;

    case "Typhoon":
    return <Text>typhoon</Text>;

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
  },
  {
    initialRouteName: 'Steps',
    navigationOptions: ({ navigation }) => ({
    })
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
    return <RootStack persistenceKey='NavState'/>;
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
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
    marginTop: 'auto',
    marginBottom: 'auto',
    flexGrow: 0,
    width: '100%',
  },
  item: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    color: '#1976D2',
  },
  itemSel: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    color: '#BDC3C7'
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    textAlign: 'center',
    fontSize: 17
  },
  textinput: {
    margin: 10,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3
  }
});
