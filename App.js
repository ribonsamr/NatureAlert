import React, {Component, PureComponent} from 'react';
import {Platform, StyleSheet, Alert, Text, View, Button, FlatList, TouchableOpacity, AsyncStorage} from 'react-native';
import {createStackNavigator} from 'react-navigation';

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
          <Text style={{ color: textColor }}>
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
    title: 'Home',
    headerStyle: {
    }
  };

  render() {
    return (
      <View>
        <Text style={styles.welcome}>Disasters</Text>
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
          {/* <Button
            title="Go to Details"
            onPress={() => this.props.navigation.navigate('Details', {title: 'Earthquake'})}
          /> */}
        </View>
      </View>
    );
  }
}


class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
    };
  };

  renderDisasters(param) {
    switch (param) {
      case "Earthquake":
        return <Text>quake</Text>;
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {this.renderDisasters(title)}
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
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
