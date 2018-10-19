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
        <View key={this.props.keyval} style={styles.Item}>
          {/* <Text style={styles.item}>{this.props.val}</Text> */}
          <TouchableOpacity onPress={this._onPress}>
            <View>
              <Text style={_style}>
                {this.props.val}
              </Text>
            </View>
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
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    color: '#1976D2',
  },
  ItemDone: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    color: '#BDC3C7'
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
    color: 'red'
  }
});
