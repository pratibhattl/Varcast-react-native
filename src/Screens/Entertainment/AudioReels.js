import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Pressable, Image} from 'react-native';
import Theme from '../../Constants/Theme';
import ClockCircleIcon from '../../assets/icons/ClockCircleIcon';
import NavigationService from '../../Services/Navigation';

const AudioReels = ({users}) => {
  const [podcastImages, setPodcastImages] = useState([]);

  useEffect(() => {
    console.log('Users:', users);
    if (users && users.length > 0) {
      const userPodcasts = users[0].podcasts.map(podcast => ({
        img: {uri: podcast.url},
        id: podcast.id,
        title: podcast.title,
        duration: podcast.duration,
      }));
      console.log('User Podcasts:', userPodcasts);
      setPodcastImages(userPodcasts);
    }
  }, [users]);
  console.log('Podcasts:', podcastImages);
  const handlePodcastPress = podcastId => {
    // Navigate to the podcast details page
    const clickedPodcast = users[0].podcasts.find(
      podcasts => podcasts.id === podcastId,
    );
    if (clickedPodcast) {
      // Navigate to the podcast details page and pass only the clicked podcast data
      NavigationService.navigate('PodcastIndex', {podcastData: clickedPodcast});
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={podcastImages}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 0, paddingVertical: 10}}
        renderItem={({item, index}) => {
          return (
            <Pressable
              onPress={() => NavigationService.navigate('PodcastIndex', {item})}
              key={index}
              style={{
                marginRight: index % 2 === 0 ? 15 : 0,
                marginTop: 10,
                borderRadius: 15,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                overflow: 'hidden',
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
                  height: 55,
                  width: 180,
                  backgroundColor: '#1C1C1C',
                  borderBottomRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontFamily: Theme.FontFamily.normal,
                    color: '#fff',
                    fontSize: Theme.sizes.s13,
                  }}>
                  {item.title}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(28, 28, 28, 0.54)',
                  height: 33,
                  width: 33,
                  borderRadius: 33,
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Theme.FontFamily.normal,
                    color: '#fff',
                    fontSize: Theme.sizes.s12,
                  }}>
                  {item.id}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(28, 28, 28, 0.54)',
                  height: 20,
                  width: 60,
                  borderRadius: 5,
                  position: 'absolute',
                  bottom: 65,
                  right: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <ClockCircleIcon />
                <Text
                  style={{
                    fontFamily: Theme.FontFamily.normal,
                    color: '#fff',
                    fontSize: 11,
                    marginHorizontal: 3,
                  }}>
                  {item.duration}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default AudioReels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    alignItems: 'center',
  },
});
