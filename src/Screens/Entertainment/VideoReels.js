import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import ClockCircleIcon from '../../assets/icons/ClockCircleIcon';
import Theme from '../../Constants/Theme';
import EyeOpen from '../../assets/icons/EyeOpen';
import NavigationService from '../../Services/Navigation';

const VideoReels = ({users}) => {
  const [videoImages, setVideoImages] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const userVideos = users[0].videos.map(video => ({
        img: {uri: video.url},
        title: video.title,
        duration: video.duration,
      }));
      setVideoImages(userVideos);
    }
  }, [users]);

  return (
    <View style={styles.container}>
      <FlatList
        data={videoImages}
        //    horizontal
        numColumns={3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 0, paddingVertical: 10}}
        renderItem={({item, index}) => {
          return (
            <Pressable
              onPress={() => NavigationService.navigate('ReelVideoIndex')}
              key={index}
              style={{
                marginRight: index == 2 ? 0 : 6,
                marginTop: 10,
              }}>
              <Image
                source={item.img}
                style={{
                  height: 180,
                  width: 180,
                }}
                resizeMode="cover"
              />
              <View
                style={{
                  // backgroundColor: 'rgba(28, 28, 28, 0.54)',
                  height: 30,
                  width: '100%',
                  borderRadius: 5,
                  position: 'absolute',
                  bottom: 5,
                  // right: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <EyeOpen Width={20} Height={20} />
                <Text
                  style={{
                    fontFamily: Theme.FontFamily.normal,
                    color: '#fff',
                    fontSize: 12,
                    marginHorizontal: 3,
                  }}>
                  10K Views
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default VideoReels;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    // alignSelf:'center'
    alignItems: 'center',
  },
});
