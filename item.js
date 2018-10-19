import React, {Component, PureComponent} from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {done: false};
  }


  _onPress = () => {
    this.setState({done: !this.state.done});
    this.render();
  };


  render() {
    let _style = this.state.done ? styles.ItemDone : styles.Item;

    return (
      <View>
        <View key={this.props.keyval}>
          <TouchableOpacity style={_style} onPress={this._onPress}>
              <Text>
                {this.props.val}
              </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.props.deleteMethod} style={styles.itemDelete}>
          <Text style={styles.itemDeleteText}>—</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  Item: {
    marginTop: 10,
    marginBottom: 10,
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
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    color: '#BDC3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7E9',
    borderRadius: 3,
    backgroundColor: '#BDBDBD',
    fontSize: 16,
  },
  itemDelete: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemDeleteText: {
    color: 'red',
  }
});
