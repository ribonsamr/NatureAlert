import React, {Component, PureComponent} from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {done: false};
  }


  _onPress = () => {
    this.setState({done: !this.state.done});
  };


  render() {
    let _style = this.state.done ? styles.ItemDone : styles.Item;

    return (
      <View>
        <View key={this.props.keyval}>
          <TouchableOpacity style={_style} onPress={this._onPress} onLongPress={this.props.deleteMethod}>
              <Text>
                {this.props.val}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

export class SimpleItem extends Component {
  render() {
    return (
      <View>
        <View key={this.props.keyval}>
          <TouchableOpacity style={styles.Item} onLongPress={this.props.deleteMethod}>
              <Text>
                {this.props.val}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  Item: {
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
  ItemDone: {
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
});
