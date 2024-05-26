import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Pressable,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenLayout from '../../Components/ScreenLayout/ScreenLayout';
import NavigationService from '../../Services/Navigation';
import {useRoute} from '@react-navigation/native';
import {ImageBackground} from 'react-native';
import CustomHeader from '../../Components/Header/CustomHeader';
import {Image} from 'react-native';
import Theme from '../../Constants/Theme';
import ClockCircleIcon from '../../assets/icons/ClockCircleIcon';
import VideoPlayIcon from '../../assets/icons/VideoPlayIcon';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import DownArrowIcon from '../../assets/icons/DownArrowIcon';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DoubleTick from '../../assets/icons/DoubleTick';
import SendIcon from '../../assets/icons/SendIcon';
import LinkIcon from '../../assets/icons/LinkIcon';
import GitftIcon from '../../assets/icons/GiftIcon';
import ShareIcon from '../../assets/icons/ShareIcon';
import RedHeartIcon from '../../assets/icons/RedHeartIcon';
import CrossIcon from '../../assets/icons/CrossIcon';
import {PermissionsAndroid, Platform} from 'react-native';
import Video from 'react-native-video';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ChannelMediaOptions,
  AudienceLatencyLevelType,
} from 'react-native-agora';
import LiveEditIcon from '../../assets/icons/LiveEditIcon';
import LiveIcon from '../../assets/icons/LiveIcon';
import EyeOpen from '../../assets/icons/EyeOpen';
import HelperFunctions from '../../Constants/HelperFunctions';
import MicroPhoneIcon from '../../assets/icons/MicrophoneIcon';
import PauseIcon from '../../assets/icons/PauseIcon';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
const {width, height} = Dimensions.get('screen');

const VideoLive = props => {
  const route = useRoute();
  const selectedData = route.params?.item;
  console.log('select Data', selectedData);
  const {width, height} = Dimensions.get('window');
  // Access the customProp passed from the source screen
  const customProp = route.params?.showButton;
  const [loadingState, changeloadingState] = useState(false);
  const [messages, setMessages] = useState('');
  const agoraEngineRef = useRef(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [isHostMic, setIsHosMic] = useState(true); // Client role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  const appId = 'ee6f53e15f78432fb6863f9baddd9bb3';
  const channelName = 'test';
  const token =
    '007eJxTYJDTnWE2W0rEvP34VofPyjYnvafsOlvB7Tep6Oo8p+9cz64rMKSmmqWZGqcamqaZW5gYG6UlmVmYGadZJiWmpKRYJiUZ8+uxpjUEMjJo/QpkYIRCEJ+FoSS1uISBAQD59R5T';
  const uid = 0;
  function showMessage(msg) {
    setMessage(msg);
  }
  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };
  const getPermissionIos = async () => {
    if (Platform.OS === 'ios') {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('MICROPHONE', statuses[PERMISSIONS.IOS.MICROPHONE]);
      });
    }
  };

  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVideoSDKEngine(appId, channelName);
    setTimeout(() => {
      if (props?.route?.params?.host) {
        joinHost(channelName, token);
      } else {
        joinAudience(channelName, token);
      }
    }, 500);
    return () => {
      leave();
    };
  }, []);

  const setupVideoSDKEngine = async (idd, channel) => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      if (Platform.OS === 'ios') {
        await getPermissionIos();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (_connection, Uid) => {
          HelperFunctions.showToastMsg(
            'Successfully joined the channel ' + channelName,
          );
          console.log('Host ID?dd>>>>>>>>', Uid, _connection.localUid);

          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          HelperFunctions.showToastMsg('Remote user joined with uid ' + Uid);
          console.log('user joined');
          console.log('user IDsdsd?>>>>>>>>', Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          console.log('user left');
          console.log('user ID offline?>>>>>>>>', Uid, _connection.localUid);
          HelperFunctions.showToastMsg(
            'Remote user left the channel. uid: ' + Uid,
          );
          setRemoteUid(0);
        },
        // onLocalAudioStateChanged: (_connection,state,error) =>{
        //     console.log('mutermcicc',state)
        // }
      });
      // console.log('khgjhghjghjggjh',idd)
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };
  const joinAudience = async (channel, tok) => {
    const agoraEngine = agoraEngineRef.current;
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      //  console.log('dfdfrewtrtertetyty',agoraEngine.getHost());
      // Use low level latency
      var channeloptions = new ChannelMediaOptions();
      // channeloptions.audienceLatencyLevel =
      // AudienceLatencyLevelType.AudienceLatencyLevelLowLatency;
      agoraEngine.updateChannelMediaOptions(channeloptions);
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
      });
      HelperFunctions.showToastMsg('Joined Successfully');
    } catch (e) {
      console.log(e);
    }
  };

  const joinHost = async (channel, tok) => {
    const agoraEngine = agoraEngineRef.current;
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );

      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
      HelperFunctions.showToastMsg('Joined Successfully');
    } catch (e) {
      console.log(e);
    }
  };
  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
      HelperFunctions.showToastMsg('You left the channel');
    } catch (e) {
      console.log(e);
    }
  };
  const SwitchCamera = () => {
    try {
      agoraEngineRef.current?.switchCamera();
    } catch (e) {
      console.log(e);
    }
  };
  const MuteMic = () => {
    try {
      // enableAudio
      if (isHostMic) {
        agoraEngineRef.current?.muteLocalAudioStream(true);
        setIsHosMic(false);
      } else {
        agoraEngineRef.current?.muteLocalAudioStream(false);
        setIsHosMic(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [allData, setAllData] = useState([
    {
      title: 'Allian Buttlar',
      date: 'typing...',
      time: '19:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'Augustas Walter',
      date: 'Hey, I’m good what about you?',
      time: '19:32',
      image: require('../../assets/images/image151.png'),
      details: 'Gold Minds with Kevin Hart',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'William Jhonson',
      date: 'By pioneering reusable rockets, SpaceX is pursuing the long-term goal,Is your team hiring? Cause I"d be a great fit.',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'David Willy',
      date: 'By pioneering reusable rockets, SpaceX is pursuing the long-term goal',
      time: ' 19:45',
      image: require('../../assets/images/image153.png'),
      details: 'Pitbull by Gold Minds with Kevin Hart',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'Steve Smith',
      date: 'Is your team hiring? Cause I"d be a great fit.',
      time: ' 19:45',
      image: require('../../assets/images/image150.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'Virat Kohli',
      date: 'Is your team hiring? Cause I"d be a great fit.',
      time: ' 19:32',
      image: require('../../assets/images/image151.png'),
      details: 'Gold Minds with Kevin Hart',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Video Watched',
      date: "Is your team hiring? Cause I'd be a great fit.",
      time: '19:45',
      image: require('../../assets/images/image153.png'),
      details: 'Pitbull by Gold Minds with Kevin Hart',
      hostedby: 'Hosted by: Kevin Hart',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
    {
      title: 'Van der dedassun',
      date: '23 Sep ',
      time: ' 14:45',
      image: require('../../assets/images/image3.png'),
      details: 'My mission is my happiness',
      hostedby: 'Hosted by: Kevin Hart',
      price: '- $ 120',
    },
  ]);
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'transparent'}
        // animated={true}
        barStyle={'light-content'}
        translucent={true}
      />
      {/* <ImageBackground
                source={require('../../assets/images/image140.png')}
                style={{
                    width: width,
                    height: height,
                    backgroundColor: 'rgba(0,0,0,0.999999999)',
                    // paddingTop: 45,
                    // alignItems: 'center',
                    shadowColor: '#131313',
                    shadowOffset: { width: 0, height: 35 },
                    shadowOpacity: 0.6,
                    // shadowRadius: 2,  
                    elevation: 20,
                    // zIndex:9999,
                    flex: 1
                    // position:'absolute',
                    // top: 0,
                }}
                resizeMode="cover"> */}

      <View style={styles.container}>
        {/* <View style={styles.btnContainer}>
                            <Text>Audience</Text>
                            <Switch
                                onValueChange={switchValue => {
                                    setIsHost(switchValue);
                                    if (isJoined) {
                                        leave();
                                    }
                                }}
                                value={isHost}
                            />
                            <Text>Host</Text>
                        </View> */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContainer}>
          {isJoined && props.route.params.host ? (
            <React.Fragment key={0}>
              <RtcSurfaceView canvas={{uid: 0}} style={styles.videoView} />
              <Text>Local user uid: {uid}</Text>
            </React.Fragment>
          ) : (
            <Text>{'Join a channel'}</Text>
          )}
          {isJoined && props.route.params.host != true && remoteUid !== 0 ? (
            <React.Fragment key={remoteUid}>
              <RtcSurfaceView
                canvas={{uid: remoteUid}}
                style={styles.videoView}
              />
              <Text>Remote user uid: {remoteUid}</Text>
            </React.Fragment>
          ) : (
            <Text>
              {isJoined && props.route.params.host != true
                ? 'Waiting for a remote user to join'
                : ''}
            </Text>
          )}
          {/* <Text style={styles.info}>{message}</Text>
                            {isJoined && props.route.params.host ? (<TouchableOpacity style={{ height: 50, width: 50, backgroundColor: 'orange', borderRadius: 50, position: 'absolute', bottom: 100, left: 10, alignItems: 'center', justifyContent: 'center' }}
                                onPress={SwitchCamera}>
                                <Text>switch</Text></TouchableOpacity>) : null} */}
        </ScrollView>
      </View>
      {/* <View style={{ height: height / 2.5 }} /> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width,
          alignItems: 'center',
          paddingHorizontal: 5,
          position: 'absolute',
          top: 50,
        }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            height: 40,
            width: 140,
            marginVertical: 25,
            marginHorizontal: 15,
            backgroundColor: 'rgba(28, 28, 28, 0.4)',
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 2,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: selectedData.image}} // Assuming 'image' is the key for the image URL in your selectedData object
              style={{
                height: 38,
                width: 38,
                borderRadius: 10,
                marginRight: 10,
              }}
              resizeMode="cover"
            />
            <View style={{marginHorizontal: 10}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: Theme.FontFamily.normal,
                }}>
                {selectedData.created_by_name}{' '}
                {/* Assuming 'created_by_name' is the key for the name in your selectedData object */}
              </Text>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.54)',
                  fontSize: 13,
                  fontFamily: Theme.FontFamily.light,
                  textAlign: 'center',
                  marginTop: 1,
                }}>
                {selectedData.views} views{' '}
                {/* Assuming 'views' is the key for the views count in your selectedData object */}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: 'black'}}>
            {/* <Video
              source={{uri: selectedData.video_link}}
              style={{width, height}}
              resizeMode="contain"
            /> */}
          </View>
        </TouchableOpacity>

        {isJoined && props.route.params.host ? (
          <TouchableOpacity
            onPress={SwitchCamera}
            style={{
              height: 38,
              width: 38,
              marginVertical: 25,
              marginHorizontal: 10,

              backgroundColor: 'rgba(28, 28, 28, 0.2)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 2,
              borderColor: 'white',
              borderStyle: 'dashed',
              borderWidth: 0.8,
            }}>
            <EyeOpen />
          </TouchableOpacity>
        ) : null}
        {isJoined && props.route.params.host ? (
          <TouchableOpacity
            onPress={() => {
              MuteMic();
            }}
            style={{
              height: 38,
              width: 38,
              marginVertical: 25,
              marginHorizontal: 10,

              backgroundColor: 'rgba(28, 28, 28, 0.2)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 2,
              borderColor: 'white',
              borderStyle: 'dashed',
              borderWidth: 0.8,
            }}>
            {isHostMic ? <MicroPhoneIcon /> : <VideoPlayIcon Color={'#fff'} />}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            leave();
            NavigationService.back();
          }}
          style={{
            height: 38,
            width: 38,
            marginVertical: 25,
            marginHorizontal: 10,

            backgroundColor: 'rgba(28, 28, 28, 0.2)',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: 2,
            borderColor: 'white',
            borderStyle: 'dashed',
            borderWidth: 0.8,
          }}>
          <CrossIcon />
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={allData}
        style={{
          position: 'absolute',
          bottom: 10,
          width: width,
          height: height / 2.2,
        }}
        renderItem={({item, ind}) => {
          return (
            <Pressable
              key={ind}
              // onPress={()=>NavigationService.navigate('ChatIndex')}
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent:'space-between',
                marginTop: 15,
                paddingLeft: 20,
                paddingRight: 15,
                height: 50,
              }}>
              <Pressable>
                <Image
                  source={item?.image}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 45,
                    borderWidth: 0.7,
                    borderColor: 'white',
                  }}
                  resizeMode="contain"
                />
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 20,
                  borderColor: 'rgba(118, 118, 128, 0.24)',
                  borderBottomWidth: 0,
                  paddingBottom: 10,
                  // marginTop:5
                }}>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: Theme.FontFamily.medium,
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.54)',
                      fontSize: 14,
                      fontFamily: Theme.FontFamily.normal,
                      marginTop: 3,
                    }}>
                    {item.date}{' '}
                  </Text>
                </View>
                {/* <Pressable
                            onPress={() => {
                                // setModalVisible(false)
                                // NavigationService.navigate('Publication02')
                            }}
                            style={{
                                marginRight:20,
                                alignItems:'flex-end'
                            }}>
                          <Text style={{
                                color: 'rgba(255, 255, 255, 0.54)',
                                fontSize: 14,
                                fontFamily: Theme.FontFamily.light,
                                marginBottom: 3
                            }}>{res.time} </Text>
                            <DoubleTick/>
                        </Pressable> */}
              </View>
            </Pressable>
          );
        }}
      />

      {/* </ImageBackground> */}
      <View style={styles.inputContainer}>
        {/* <View style={{}}> */}
        {/* <LinkIcon/> */}
        <TextInput
          multiline={true}
          style={[styles.input, {minHeight: 40, maxHeight: 100}]}
          placeholder="Message..."
          value={messages}
          onChangeText={setMessages}
          placeholderTextColor={Theme.colors.white}
        />

        <TouchableOpacity
          // disabled={message.trim().length==0}
          style={[
            styles.sendButton,
            {
              backgroundColor: 'transparent',
              // message.trim().length==0?Theme.colors.grey:Theme.colors.primary
            },
          ]}
          //   onPress={()=>{ sendMsg() }}
        >
          <SendIcon />
        </TouchableOpacity>
      </View>
      <View
        style={{
          // flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 30,
          // left:0,
          right: 20,
          // paddingHorizontal:20,
          // paddingVertical:10,
        }}>
        <Pressable
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: 'rgba(27, 27, 27, 0.86)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <GitftIcon />
        </Pressable>
        <Pressable
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: 'rgba(27, 27, 27, 0.86)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <ShareIcon />
        </Pressable>
        <Pressable
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: 'rgba(27, 27, 27, 0.86)',
            alignItems: 'center',
            justifyContent: 'center',
            // marginBottom:10
          }}>
          <RedHeartIcon />
        </Pressable>
      </View>
    </View>
  );
};

export default VideoLive;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // width:width
    // paddingHorizontal: 20
    backgroundColor: '#131313',
    height: height,
    // paddingTop:100
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 8,
    paddingVertical: 10,
    height: 50,
    backgroundColor: 'rgba(27, 27, 27, 0.8)',
    width: '75%',
    padding: 10,
    position: 'absolute',
    bottom: 30,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    borderRadius: 30,
    // marginTop:30
  },
  sendButton: {
    borderRadius: 50,
    backgroundColor: 'white',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    // borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    color: Theme.colors.white,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,

    padding: 10,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1},
  scroll: {flex: 1, backgroundColor: '#131313', width: '100%', height: '100%'},
  scrollContainer: {alignItems: 'center', height: '100%'},
  videoView: {width: '100%', height: '90%'},
  btnContainer: {flexDirection: 'row', justifyContent: 'center', height: 50},
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff'},
});

{
  /* <ScreenLayout
headerStyle={{ backgroundColor: 'rgba(27, 27, 27, 0.96);' }}
showLoading={loadingState}
isScrollable={true}
leftHeading={'Podcast Details'}
// Podcast
// right
Watch
// Live={cat == 'Live' ? true : false}
leftHeadingStyle={{ color: '#E1D01E' }}
hideLeftIcon={customProp ? false : true}
onLeftIconPress={() => NavigationService.back()}> 
 <Pressable style={{
                    position: 'absolute',
                    bottom: -25,
                    right: 10,
                    height: 50,
                    width: 50,
                    borderRadius: 30,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <VideoPlayIcon Width={30} Height={30} />
                </Pressable>
*/
}
