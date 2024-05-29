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
import {apiCall} from '../../Services/Service';
import AudioReels from '../Entertainment/AudioReels';
import VideoReels from '../Entertainment/VideoReels';
import {useSelector, useDispatch} from 'react-redux';
import ShareIcon from '../../assets/icons/ShareIcon';
import AudioReelsIcon from '../../assets/icons/AudioReelsIcon';
import VideoReelsIcon from '../../assets/icons/VideoReelsIcon';
import {followUser} from '../../Store/Reducers/CommonReducer';
import {t} from 'i18next';
const {width, height} = Dimensions.get('screen');

const ProfileIndex = () => {
  const Tab = createMaterialTopTabNavigator();
  const route = useRoute();
  // const {userDetails} = useSelector(state => state.authData);
  const token = useSelector(state => state.authData.token);
  const [loadingState, setLoadingState] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  console.log('useD', userDetails);
  const {following} = useSelector(state => state.commonData); // Get following state from the store
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleFollow = () => {
    dispatch(followUser()); // Dispatch the followUser action when the button is pressed
  };
  useEffect(() => {
    const fetchLoggedInUserData = async () => {
      try {
        const endpoint = 'get-user';
        const response = await apiCall(endpoint, 'GET', {}, token);
        const data = response.data;
        console.log('data', data);
        // const mappedData = data?.map(item => ({
        //   name: item.name,
        //   email: item.email,
        //   imageUrl: item.imageUrl,
        //   videoUrl: item.videoUrl,
        // }));
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching My profile data:', error);
      }
    };
    fetchLoggedInUserData();
  }, []);

  const handleShare = async () => {
    try {
      const profileLink = `https://example.com/profile/${userDetails}`;
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
        // animated={true}
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
            // flex:1
          }}
          resizeMode="cover">
          <HomeHeader
            style={{backgroundColor: 'transparent', paddingTop: 60}}
            headerStyle={{paddingTop: 0}}
            Edit
            EditIconPress={() => NavigationService.navigate('EditProfile')}
            // leftHeading={'Book an Appointment'}
            onLeftIconPress={() => NavigationService.openDrawer()}
          />
          <View
            style={{
              // height:100
              padding: 25,
              // alignItems:'center'
              // paddingTop:45
            }}>
            <Image
              source={
                userDetails?.full_path_image
                  ? {uri: userDetails?.full_path_image}
                  : require('../../assets/images/image.png')
              }
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
              {userDetails.name}
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
              44,189,642 views
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
                  {userDetails.count_followers}
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
                  {userDetails.count_videos}
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
                  {userDetails.count_podcasts}
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
                  {userDetails.count_followings}
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
              // borderRadius:100
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#525252',
            tabBarShowLabel: false,
            tabBarLabelStyle: {
              // fontFamily: Theme.FontFamily.medium,
              fontSize: 0,
              textTransform: 'capitalize',
            },
            // tabBarScrollEnabled: true,
            tabBarIndicatorStyle: {
              backgroundColor: '#fff',
              height: 1.3,
            },
            tabBarItemStyle: {
              // maxWidth:'110%',
              // backgroundColor:'red'
            },
            swipeEnabled: true,
            // tabBarScrollEnabled: true
          }}
          style={
            {
              // marginVertical: 10,
              // backgroundColor: "#171717"
            }
          }>
          <Tab.Screen
            name="AudioReels"
            options={{
              unmountOnBlur: true,
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
                      // fontFamily:Theme.FontFamily.normal
                    }}>
                    {userDetails.count_podcasts}
                  </Text>
                </Pressable>
              ),
            }}>
            {() => <AudioReels userData={userDetails} />}
          </Tab.Screen>
          <Tab.Screen
            name="VideoReels"
            options={{
              unmountOnBlur: true,
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
                      // fontFamily:Theme.FontFamily.normal
                    }}>
                    {userDetails.count_videos}
                  </Text>
                </Pressable>
              ),
            }}>
            {() => <VideoReels userData={userDetails} />}
          </Tab.Screen>
        </Tab.Navigator>
      </ScrollView>
    </View>
  );
};

export default ProfileIndex;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    heightL: height,
    // backgroundColor: 'rgba(27, 27, 27, 0.96)',
  },
});
// <ScreenLayout
// headerStyle={{backgroundColor: '#131313'}}
// showLoading={loadingState}
// isScrollable={true}
// // leftHeading={'Book an Appointment'}
// Home
// hideLeftIcon={customProp ? false : true}
// onLeftIconPress={() => NavigationService.openDrawer()}>
