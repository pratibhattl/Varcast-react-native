/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-basic-elements';
import {useRoute} from '@react-navigation/native';
import NavigationService from '../../Services/Navigation';
import HomeHeader from '../../Components/Header/HomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Theme from '../../Constants/Theme';
import {Image} from 'react-native';
import AudioReels from '../Entertainment/AudioReels';
import VideoReels from '../Entertainment/VideoReels';
import {useSelector, useDispatch} from 'react-redux';
import ShareIcon from '../../assets/icons/ShareIcon';
import AudioReelsIcon from '../../assets/icons/AudioReelsIcon';
import VideoReelsIcon from '../../assets/icons/VideoReelsIcon';
import {followUser} from '../../Store/Reducers/CommonReducer';
import {t} from 'i18next';
const {width, height} = Dimensions.get('screen');
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/Header/CustomHeader';

const UserDetails = props => {
  const route = useRoute();
  const {userData} = route.params;
  // console.log(userData);
  // console.log(userData.name);
  const Tab = createMaterialTopTabNavigator();
  const [loadingState, setLoadingState] = useState(false);
  const {following} = useSelector(state => state.commonData);
  const dispatch = useDispatch();

  const handleFollow = () => {
    dispatch(followUser());
  };

  const handleShare = async () => {
    try {
      const profileLink = `https://example.com/profile/${userData.name}`;
      const result = await Share.share({
        message: `Check out my profile: ${profileLink}`,
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        translucent={true}
      />
      <ScrollView contentContainerStyle={{flex: 1}}>
        <ImageBackground
          source={require('../../assets/images/Maskgroup.png')}
          style={{
            width: width,
            height: height / 2,
            backgroundColor: '#131313',
          }}
          resizeMode="cover">
          <CustomHeader
            style={{backgroundColor: 'transparent', paddingTop: 60}}
            headerStyle={{paddingTop: 0}}
            onLeftIconPress={() => NavigationService.back()}
            showLeftIcon={props.showLeftIcon}
          />
          <View
            style={{
              padding: 25,
            }}>
            <Image
              source={{uri: userData?.full_path_image}}
              style={{
                height: 75,
                width: 75,
                borderRadius: 15,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 19,
                fontFamily: Theme.FontFamily.medium,
                marginTop: 12,
                textAlign: 'center',
              }}>
              {userData?.name}
            </Text>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.54)',
                fontSize: 15,
                fontFamily: Theme.FontFamily.light,
                marginTop: 0,
                textAlign: 'center',
                lineHeight: 25,
              }}>
              {/* {userData.total_views} views */}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <TouchableOpacity
                onPress={() => NavigationService.navigate('Followers')}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    fontFamily: Theme.FontFamily.medium,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {userData.count_followers}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.54)',
                    fontSize: 15,
                    fontFamily: Theme.FontFamily.light,
                    marginTop: 0,
                  }}>
                  {t('Followers')}
                </Text>
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    fontFamily: Theme.FontFamily.medium,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {userData.count_videos}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.54)',
                    fontSize: 15,
                    fontFamily: Theme.FontFamily.light,
                    marginTop: 0,
                  }}>
                  {t('Videos')}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    fontFamily: Theme.FontFamily.medium,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  {userData.count_podcasts}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.54)',
                    fontSize: 15,
                    fontFamily: Theme.FontFamily.light,
                    marginTop: 0,
                  }}>
                  {t('Podcast')}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 19,
                    fontFamily: Theme.FontFamily.medium,
                    marginTop: 10,
                    textAlign: 'center',
                  }}>
                  {userData.count_followings}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.54)',
                    fontSize: 15,
                    fontFamily: Theme.FontFamily.light,
                    marginTop: 0,
                  }}>
                  {t('Following')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 5,
              }}>
              <TouchableOpacity
                onPress={handleFollow}
                style={{
                  height: 45,
                  width: 165,
                  borderRadius: 50,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="plus" type="Entypo" size={22} color={'#000'} />
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: Theme.FontFamily.normal,
                    marginTop: 0,
                    marginHorizontal: 5,
                  }}>
                  {following ? t('Unfollow') : t('Follow')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  height: 45,
                  width: 165,
                  borderRadius: 50,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderWidth: 1,
                }}>
                <ShareIcon />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: Theme.FontFamily.normal,
                    marginTop: 0,
                    marginHorizontal: 5,
                  }}>
                  {t('Share')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#171717',
              paddingVertical: 7,
              borderColor: '#525252',
              borderBottomWidth: 0.2,
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#525252',
            tabBarShowLabel: false,
            tabBarLabelStyle: {
              fontSize: 0,
              textTransform: 'capitalize',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#fff',
              height: 1.3,
            },
            swipeEnabled: true,
          }}>
          <Tab.Screen
            name="AudioReels"
            options={{
              tabBarIcon: ({color}) => (
                <Pressable>
                  <VideoReelsIcon Color={color} />
                  <Text
                    style={{
                      color: '#fff',
                      position: 'absolute',
                      top: -10,
                      right: -15,
                      fontSize: 10,
                    }}>
                    {userData.count_podcasts}
                  </Text>
                </Pressable>
              ),
            }}>
            {() => <AudioReels users={[userData]} />}
          </Tab.Screen>
          <Tab.Screen
            name="VideoReels"
            options={{
              tabBarIcon: ({color}) => (
                <Pressable>
                  <AudioReelsIcon Color={color} />
                  <Text
                    style={{
                      color: color,
                      position: 'absolute',
                      top: -10,
                      right: -15,
                      fontSize: 10,
                    }}>
                    {userData.count_videos}
                  </Text>
                </Pressable>
              ),
            }}>
            {() => <VideoReels users={[userData]} />}
          </Tab.Screen>
        </Tab.Navigator>
      </ScrollView>
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    heightL: height,
  },
});
