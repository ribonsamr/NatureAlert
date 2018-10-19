import React, {Component, PureComponent} from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class Item extends Component {
  render() {

    return (
      <View key={this.props.keyval} style={styles.Item}>
        <Text style={styles.item}>{this.props.val}</Text>

        <TouchableOpacity onPress={this.props.deleteMethod} style={styles.itemDelete}>
          <Text style={styles.itemDeleteText}>—</Text>
        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  Item: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
  },
<<<<<<< HEAD
  itemDelete: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    right: 10,
    bottom: 10,
  }
=======
>>>>>>> f98a496668f3566899d90d05bc86173570e1c62f
});
