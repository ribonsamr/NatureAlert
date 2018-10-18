import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, ScrollView, Alert, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import {earthquakeBeforeList, earthquakeDuringList, earthquakeAfterList} from './data.js';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

type Props = {};

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? "red" : "black";
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor, backgroundColor: 'grey' }}>
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
      <View>
        <View>
          <FlatList style={styles.list}
            data={[{key:'Earthquake'}, {key: 'Volcano'}, {key: 'Storm'}, {key: 'Typhoon'}]}
            renderItem={({item}) => <Button
              title={item.key}
              onPress={() =>
                this.props.navigation.navigate('Details', { title: item.key })
              }
            />}
          />
        </View>
      </View>
    );
  }
}

class BagScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Bag',
    };
  };
  render() {
    const { navigation } = this.props;
    const title = navigation.getParam('title');

    return (
      <View>
        <Text>{this.title}</Text>
      </View>
    );
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
      return <ScrollView>
        <Text>Before an Earthquake:</Text>

        <Text>Make sure to have:</Text>
        <MultiSelectList data={earthquakeBeforeList}></MultiSelectList>

        <Text>During an Earthquake:</Text>
        <MultiSelectList data={earthquakeDuringList}></MultiSelectList>

        <Text>After an Earthquake:</Text>
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
    return <RootStack />;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 22,
    paddingBottom: 22
  },
  welcome: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  list: {
    margin: 20,
    flexGrow: 0
  },
  item: {
    fontSize:20,
    margin: 5,
    paddingTop: 10,
  }
});
