import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IHeroPanCard {
  index: number;
  item: string;
  replacePawnHandler: (item: string) => void;
}

const HeroPawnCard: React.FC<IHeroPanCard> = ({
  index,
  item,
  replacePawnHandler,
}) => {
  return (
    <TouchableOpacity
      onPress={() => replacePawnHandler(item)}
      key={index.toString()}>
      <View
        style={{backgroundColor: '#a2a2a2', padding: 5, borderRadius: 10}}
        key={index.toString()}>
        <MaterialCommunityIcons name={item} size={40} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default HeroPawnCard;
