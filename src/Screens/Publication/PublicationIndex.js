import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenLayout from '../../Components/ScreenLayout/ScreenLayout';
import NavigationService from '../../Services/Navigation';
import {useRoute} from '@react-navigation/native';
import CameraIcon from '../../assets/icons/CameraIcon';
import Theme from '../../Constants/Theme';
import PlayBackIcon from '../../assets/icons/PlaybackIcon';
import TemplateIcon from '../../assets/icons/TemplateIcon';
import {BlurView} from '@react-native-community/blur';
import LiveHeader from '../../Components/Header/LiveHeader';
import LiveEditIcon from '../../assets/icons/LiveEditIcon';
import LiveIcon from '../../assets/icons/LiveIcon';
import RefressIcon from '../../assets/icons/RefressIcon';
import GallaryIcon from '../../assets/icons/GallaryIcon';
import {AppTextInput} from 'react-native-basic-elements';
import {useTranslation} from 'react-i18next';
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
} from 'react-native-photoeditorsdk';
import ImagePicker from 'react-native-image-crop-picker';
import {VESDK, CanvasAction, AudioClip} from 'react-native-videoeditorsdk';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import {PermissionsAndroid} from 'react-native';
import {apiCall} from '../../Services/Service';
import HelperFunctions from '../../Constants/HelperFunctions';
import {useSelector} from 'react-redux';
import AllSourcePath from '../../Constants/PathConfig';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
// import { loadingState } from "../../../../../../../../";
const {width, height} = Dimensions.get('screen');

const PublicationIndex = props => {
  const route = useRoute();
  // require the module
  // var RNFS = require('react-native-fs');
  var result = null;

  // Access the customProp passed from the source screen
  const customProp = route.params?.showButton;
  const [loadingStates, changeloadingStates] = useState(false);
  const [Imagee, changeImagee] = useState('');
  const [pickedImg, setPickedImg] = useState();
  const [audio, setAudio] = useState();
  const [imgUrl, setImgUrl] = useState('');
  const [allImage, setAllImage] = useState([]);
  const token = useSelector(state => state.authData.token);
  const audioToken =
    '007eJxTYJDTnWE2W0rEvP34VofPyjYnvafsOlvB7Tep6Oo8p+9cz64rMKSmmqWZGqcamqaZW5gYG6UlmVmYGadZJiWmpKRYJiUZ8+uxpjUEMjJo/QpkYIRCEJ+FoSS1uISBAQD59R5T';
  const [cat, setCat] = useState('Publication');
  const [option, setOption] = useState('');
  const [name, setName] = useState('');
  const [overView, setOverView] = useState('');
  const [Loder, setLoader] = useState(false);
  const {t} = useTranslation();
  const [Musiclist, setMusiclist] = useState([]);
  const licenseAndroid = require('../../assets/vesdk_license/vesdk_license.android.json');
  const licenseIos = require('../../assets/vesdk_license/vesdk_license.ios.json');

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ]);
    }
  };
  const getPermissionIos = async () => {
    if (Platform.OS === 'ios') {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]).then(statuses => {
        // console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        // console.log('MICROPHONE', statuses[PERMISSIONS.IOS.MICROPHONE]);
        // console.log('MEDIA_LIBRARY', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
      });
    }
  };

  const fetchAllPublicationList = async () => {
    setLoader(true);
    try {
      const endpoint = 'videos/list';
      const response = await apiCall(endpoint, 'GET', {}, token);
      const data = response?.data?.listData; // Assuming response is already parsed as JSON
      const mappedData = data?.map(item => ({
        title: item.title,
        slug: item.slug,
        img: item.imageUrl,
        videoUrl: item.videoUrl,
      }));
      setAllImage(mappedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchAllPublicationList();
  }, []);

  const uploadPublicationData = file => {
    setLoader(true);
    const formData = new FormData();
    formData.append('image', file);

    // apiCall('videos/create', formData, '', 'multipart/form-data')
    axios
      .post(`${baseUrl}videos/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenData}`,
        },
      })
      .then(response => {
        console.log('response', response);
        if (response?.status == 'true') {
          changeImagee(url);
          // let image = `${AllSourcePath.API_BASE_URL_DEV}upload`
          allImage.unshift({img: url, self: true});
          setAllImage([...allImage]);
          setLoader(false);
        } else {
          // setModalVisible(true)
          setLoader(false);
        }
      })
      .catch(error => {
        HelperFunctions.showToastMsg(error?.message);
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const openPhotoFromLocalPathExample = async () => {
    try {
      // Add a photo from the assets directory.

      //   const license = await PESDK.unlockWithLicense("./pesdk_license");
      // } catch (error) {
      // console.log(`Failed to unlock PE.SDK with error: ${error}.`);
      // }
      // if (Platform.OS === 'ios') { await getPermissionIos() };
      let pickerResult = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      if (pickerResult.cancelled) {
        return;
      }
      // console.log("Selected images", pickerResult.path);
      const result = await PESDK.openEditor(pickerResult.path);
      // ImagePicker.openPicker({
      //     width: 300,
      //     height: 400,
      //     cropping: true
      //   }).then(image => {
      //     console.log(image);
      //     console.log("PESDK.openEditor(image.path)",PESDK.openEditor(image.path));

      //     result = PESDK.openEditor(image.path);
      //   });
      // const photo = require("../../assets/images/image105.png");

      // Open the photo editor and handle the export as well as any occuring errors.
      const fileUri = pickerResult.path;
      // const fileData = await RNFS.readFile(fileUri, 'base64');
      const fileName = fileUri.split('/').pop();
      const fileType = fileName.split('.').pop();

      const file = {
        uri: fileUri,
        name: fileName,

        type: `image/${fileType}`,
      };
      // if (result != null) {

      uploadPublicationData(file);

      // setAllImage(s => s.map((res, ind) => ind == 0 ? { ...res, img: result.image,self:true } : { ...res }))
      // } else {
      //   // The user tapped on the cancel button within the editor.
      //   console.log('nocddt found');
      //   return;
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const openVideoFromLocalPathExample = async () => {
    // Create a `Configuration` object.
    // Sources of the local audio clips.
    const audioSources = [
      require('../../assets/vesdk/newsong.mp3'),
      require('../../assets/vesdk/file_example.mp3'),
      require('../../assets/vesdk/file_example1.mp3'),
      // require("../../../../../assets/vesdk/far_from_home.mp3"),
    ];

    // The processed `AudioClip`s.
    var audioClips = [];

    // Convert the sources to valid `AudioClip`s.
    audioSources.forEach(source => {
      const uri = Image.resolveAssetSource(source).uri;
      const prefix = '/assets/vesdk/';

      // Generate the identifier based on the prefix.
      const identifier = uri.substring(
        uri.indexOf(prefix) + prefix.length,
        uri.indexOf('.mp3'),
      );

      const audioClip = {
        identifier: identifier,
        audioURI: uri,
      };
      audioClips.push(audioClip);
    });

    // Create a `Configuration` object.
    const configuration = {
      audio: {
        categories: [
          {
            identifier: 'elsewhere',
            name: 'Elsewhere',
            items: audioClips.slice(0, 3),
          },
          {
            identifier: 'other',
            name: 'Other',
            items: audioClips.slice(3),
          },
        ],
        // By default, the editor only allows the `CanvasAction.DELETE`.
        // For this example, the user should also be able to play and
        // pause the audio.
        canvasActions: [CanvasAction.DELETE, CanvasAction.PLAY_PAUSE],
      },
    };

    try {
      // Add a video from the assets directory.
      Platform.OS === 'ios'
        ? await VESDK.unlockWithLicense(licenseIos)
        : await VESDK.unlockWithLicense(licenseAndroid);
      const video = require('../../assets/Video/production.mp4');
      const result = await VESDK.openEditor(video, configuration);
      if (result != null) {
        // The user exported a new video successfully and the newly generated video is located at `result.video`.

        console.log('videdoready', result.video, {
          ...result,
          path: result.video,
          mime: 'video/mp4',
          modificationDate: Date.now(),
        });
        NavigationService.navigate('Publication02', {
          reelDetails: {
            ...result,
            path: result.video,
            mime: 'video/mp4',
            modificationDate: Date.now(),
          },
        });
      } else {
        // The user tapped on the cancel button within the editor.
        console.log('ddsffs', result);
        return;
      }
    } catch (error) {
      // There was an error generating the video.
      console.log(error);
      // setRecoil(loadingState, true);
    }
  };

  const openVideoFromRemoteUrlExample = async () => {
    // Create a `Configuration` object.
    // Sources of the local audio clips.
    // const audioSources = [
    //     { full_path_file: "https://www.pagalworld.com.cm/files/download/type/128/id/68671" },
    //     { full_path_file: "https://pagalfree.com/download/128-Sher%20Khul%20Gaye%20-%20Fighter%20128%20Kbps.mp3" },
    //     { full_path_file: 'https://www.pagalworld.com.cm/files/download/type/64/id/69950' },
    //     // require("../../../../../assets/vesdk/far_from_home.mp3"),
    // ];
    const audioSources = Musiclist;

    // The processed `AudioClip`s.
    var audioClips = [];

    // Convert the sources to valid `AudioClip`s.
    audioSources.forEach((source, ind) => {
      // const remoteURL = `https://img.ly/static/example-assets/${identifier}.mp3`;

      // const uri = Image.resolveAssetSource(source).https://pagalnew.com/download128/45972;
      const prefix = 'https:';

      // Generate the identifier based on the prefix.
      const identifier = source.full_path_file.substring(
        ind + 1,
        source.full_path_file.indexOf(prefix) + prefix.length,
      );

      const audioClip = {
        identifier: identifier,
        audioURI: source.full_path_file,
      };
      audioClips.push(audioClip);
    });

    // Create a `Configuration` object.
    const configuration = {
      audio: {
        categories: [
          {
            identifier: 'MainAlbum',
            name: 'Album',
            items: audioClips,
          },
        ],
        // By default, the editor only allows the `CanvasAction.DELETE`.
        // For this example, the user should also be able to play and
        // pause the audio.
        canvasActions: [CanvasAction.DELETE, CanvasAction.PLAY_PAUSE],
      },
    };

    try {
      // Add a video from the assets directory.
      //   const video = require("../../assets/Video/production.mp4");

      // Open the video editor and handle the export as well as any occuring errors.
      //   const result = await VESDK.openEditor(video);
      Platform.OS === 'ios'
        ? await VESDK.unlockWithLicense(licenseIos)
        : await VESDK.unlockWithLicense(licenseAndroid);

      if (Platform.OS === 'ios') {
        await getPermissionIos();
      }
      let pickerResult = await ImagePicker.openCamera({
        mediaType: 'video',
      });
      if (pickerResult.cancelled) {
        return;
      }
      const result = await VESDK.openEditor(pickerResult.path, configuration);
      if (result != null) {
        // The user exported a new video successfully and the newly generated video is located at `result.video`.
        console.log('videdoready', result.video, {
          ...result,
          path: result.video,
          mime: 'video/mp4',
          modificationDate: Date.now(),
        });
        NavigationService.navigate('Publication02', {
          reelDetails: {
            ...result,
            path: result.video,
            mime: 'video/mp4',
            modificationDate: Date.now(),
          },
        });
      } else {
        // The user tapped on the cancel button within the editor.
        return;
      }
    } catch (error) {
      // There was an error generating the video.
      console.log(error);
      // setRecoil(loadingState, true);
    }
  };

  const fetchMusicList = () => {
    setLoader(true);
    let data = {
      limit: '10',
      keyword: '',
      page: null,
    };
    apiCall('api/all-music', data, '')
      .then(response => {
        // console.log('response',response)
        if (response?.status == 'success') {
          setMusiclist(response?.data);
          setLoader(false);
        } else {
          // setModalVisible(true)
          setLoader(false);
        }
      })
      .catch(error => {
        HelperFunctions.showToastMsg(error?.message);
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  //---------------------------------------------------------------------------------------------------//

  //  Create new podcast //

  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('pickedFile', pickedFile);

      pickedFile.type === 'audio/mpeg'
        ? setAudio(pickedFile)
        : setPickedImg(pickedFile);

      if (pickedFile.type === 'image/jpeg') {
        console.log('START');
        // const realPath = await RNFetchBlob.fs.contentUriToPath(pickedFile.uri);
        // console.log('img', `file://${realPath}`);

        const abc = await RNFS.readFile(pickedFile.uri, 'base64');
        console.log('abc',abc)
        setImgUrl(abc)
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('err', err);
      } else {
        console.log('error', error);
        throw err;
      }
    }
  };

  const tokenData = useSelector(state => state.authData.token);

  const baseUrl = AllSourcePath.API_BASE_URL_DEV;
  const imageUrl = AllSourcePath.IMAGE_BASE_URL;

  const fileSubmit = async () => {
    let formData = new FormData();

    formData.append('title', name);
    formData.append('overview', overView);
    formData.append('image', pickedImg);
    formData.append('audio', audio);
    console.log(formData);
    setLoader(true);

    try {
      const data = await axios.post(`${baseUrl}podcast/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenData}`,
        },
      });
      setName('');
      setOverView('');
      setPickedImg();
      setAudio();
      HelperFunctions.showToastMsg('Podcast has been sucessfully uploaded');
      NavigationService.navigate('ProfileIndex');
      return data;
    } catch (error) {
      console.log('error', error);
      HelperFunctions.showToastMsg(error?.message);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMusicList();
  }, []);
  useEffect(() => {
    if (Platform.OS === 'android') {
      getPermission();
    }
    if (Platform.OS === 'ios') {
      getPermissionIos();
    }
    // console.log('Image.resolveAssetSource(source).uri',URL.createObjectURL('https://pagalnew.com/download128/45972'))
  }, []);

  console.log('imgUrl', imgUrl);

  return (
    <View style={{flex: 1}}>
      {/* {console.log('sdsdsdsdsd>>>>>>',allImage)} */}
      {cat == 'Publication' ? (
        <ScreenLayout
          headerStyle={{backgroundColor: 'rgba(27, 27, 27, 0.96)'}}
          showLoading={loadingStates || Loder}
          isScrollable={true}
          leftHeading={'New Publication'}
          // viewStyle={{backgroundColor:'transparent'}}
          // right
          onRightTextPress={() => NavigationService.navigate('Publication01')}
          Live={cat == 'Live' ? true : false}
          leftHeadingStyle={{color: '#E1D01E'}}
          hideLeftIcon={customProp ? false : true}
          onLeftIconPress={() => NavigationService.back()}>
          <View style={styles.container}>
            <View style={{alignSelf: 'center'}}>
              <FlatList
                data={[1, 2, 3]}
                //    horizontal
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 0, paddingTop: 20}}
                renderItem={({item, index}) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (index === 0) {
                          openPhotoFromLocalPathExample();
                        } else if (index === 1) {
                          openVideoFromLocalPathExample();
                        } else {
                          openVideoFromRemoteUrlExample();
                        }
                      }}
                      key={index}
                      style={{
                        height: 80,
                        width: 120,
                        borderRadius: 15,
                        backgroundColor: '#1C1C1C',
                        marginRight: index == 2 ? 0 : 7,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {index == 0 ? (
                        <CameraIcon />
                      ) : index == 1 ? (
                        <PlayBackIcon Size={32} Color={'#fff'} />
                      ) : (
                        <TemplateIcon />
                      )}
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: Theme.FontFamily.normal,
                          marginTop: 5,
                        }}>
                        {index == 0
                          ? 'Camera'
                          : index == 1
                          ? 'Drafts'
                          : 'Templates'}
                      </Text>
                    </Pressable>
                  );
                }}
              />

              <FlatList
                data={allImage}
                //    horizontal
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 0,
                  paddingVertical: 10,
                }}
                renderItem={({item, index}) => {
                  return (
                    <View
                      key={index}
                      style={{
                        marginRight: index == 2 ? 0 : 7,
                        marginTop: 10,
                      }}>
                      <Image
                        // source={item?.self ? {uri: item?.img} : item?.img}
                        source={{uri: `${imageUrl}${item?.img}`}}
                        style={{
                          height: 180,
                          width: 120,
                          borderRadius: 15,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScreenLayout>
      ) : cat == 'Live' ? (
        <View style={{flex: 1}}>
          <StatusBar
            backgroundColor={'transparent'}
            // animated={true}
            barStyle={'light-content'}
            translucent={true}
          />
          <ImageBackground
            source={require('../../assets/images/image164.png')}
            style={{
              width: width,
              height: height,
              // paddingTop:40
            }}
            resizeMode="cover">
            <LiveHeader
              leftHeading={t('New Publication')}
              onLeftIconPress={() => NavigationService.back()}
            />
          </ImageBackground>
        </View>
      ) : (
        <ScreenLayout
          headerStyle={{backgroundColor: 'rgba(27, 27, 27, 0.96);'}}
          showLoading={loadingStates}
          isScrollable={true}
          leftHeading={t('New Publication')}
          Podcast
          right
          Live={cat == 'Live' ? true : false}
          leftHeadingStyle={{color: '#E1D01E'}}
          hideLeftIcon={customProp ? false : true}
          onLeftIconPress={() => NavigationService.back()}>
          <View
            style={{...styles.container, alignItems: 'center', height: height}}>
            <Pressable
              onPress={async () => await uploadFileOnPressHandler()}
              style={{
                height: 130,
                width: 130,
                borderRadius: 20,
                backgroundColor: '#1C1C1C',
                marginTop: 45,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.14)',
              }}>
              {pickedImg?.uri && (
                <Image
                  source={{uri: `data:image/jpeg;base64,${imgUrl}`}}
                  resizeMode='cover'
                  style={{width: 200, height: 200}}
                />
              )}

              {!pickedImg && <GallaryIcon />}
            </Pressable>
            <AppTextInput
              value={name}
              onChangeText={a => setName(a)}
              placeholder="Name Podcast"
              placeholderTextColor={'rgba(255, 255, 255, 0.54)'}
              inputStyle={{fontSize: 14}}
              titleStyle={{
                fontFamily: Theme.FontFamily.semiBold,
                fontSize: Theme.sizes.s16,
              }}
              mainContainerStyle={
                {
                  //   marginHorizontal:20
                }
              }
              inputContainerStyle={styles.input_container_sty}
              style={styles.text_style}
            />
            <AppTextInput
              value={overView}
              onChangeText={a => setOverView(a)}
              placeholder="Overview"
              placeholderTextColor={'rgba(255, 255, 255, 0.44)'}
              inputStyle={{fontSize: 15}}
              titleStyle={{
                fontFamily: Theme.FontFamily.semiBold,
                fontSize: Theme.sizes.s16,
              }}
              mainContainerStyle={
                {
                  //   marginHorizontal:20
                }
              }
              inputContainerStyle={styles.input_container_sty}
              style={styles.text_style}
            />

            <View style={styles.upload}>
              {audio && (
                <Text
                  style={{
                    ...styles.upload_text,
                    width: 100,
                    overflow: 'hidden',
                    marginRight: 10,
                  }}>
                  {audio.name}
                </Text>
              )}
              {!audio && (
                <Text style={styles.upload_text}> Upload Audio File</Text>
              )}
              <Pressable
                style={styles.upload_btn}
                onPress={async () => await uploadFileOnPressHandler()}>
                <Text
                  style={{
                    fontFamily: Theme.FontFamily.normal,
                    textAlign: 'center',
                    fontSize: 15,
                    color: '#fff',
                  }}>
                  Upload
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={fileSubmit}
              style={{...styles.upload_btn, width: 350, marginTop: 20}}>
              <Text style={styles.upload_text}>SUBMIT</Text>
            </Pressable>
            {/* <Pressable
              style={{
                height: 64,
                width: 64,
                borderRadius: 64,
                borderWidth: 1.5,
                borderColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <Pressable
                onPress={() => NavigationService.navigate('OwnPodcastLive')}
                style={{
                  height: 54,
                  width: 54,
                  borderRadius: 64,
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',

                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                  // marginTop:50
                }}>
                <View
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 25,
                    backgroundColor: '#ED4040',
                  }}></View>
              </Pressable>
            </Pressable> */}
          </View>
        </ScreenLayout>
      )}

      {cat == 'Live' ? (
        <Pressable
          style={{
            borderRadius: 100,
            position: 'absolute',
            bottom: 100,
            height: 53,
            width: 300,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            // backgroundColor: 'rgba(28, 28, 28, 0.82)'
          }}>
          <Pressable
            style={{
              height: 64,
              width: 64,
              borderRadius: 64,
              borderWidth: option == 'Edit' ? 1.5 : 0,
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={() => setOption('Edit')}
              style={{
                height: 54,
                width: 54,
                borderRadius: 64,
                backgroundColor:
                  option == 'Edit'
                    ? 'rgba(255, 255, 255, 0.98)'
                    : 'rgba(28, 28, 28, 0.54)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: option == 'Edit' ? 2 : 0,
                borderColor: '#fff',
              }}>
              <LiveEditIcon Color={option == 'Edit' ? '#000' : '#fff'} />
            </Pressable>
          </Pressable>

          <Pressable
            style={{
              height: 64,
              width: 64,
              borderRadius: 64,
              borderWidth: option == 'Live' ? 1.5 : 0,
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={() => {
                setOption('Live');
                NavigationService.navigate('VideoLive', {host: true});
              }}
              style={{
                height: 54,
                width: 54,
                borderRadius: 64,
                backgroundColor:
                  option == 'Live'
                    ? 'rgba(255, 255, 255, 0.98)'
                    : 'rgba(28, 28, 28, 0.54)',

                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: option == 'Live' ? 2 : 0,
                borderColor: '#fff',
              }}>
              <LiveIcon Color={option == 'Live' ? '#000' : '#fff'} />
            </Pressable>
          </Pressable>

          <Pressable
            style={{
              height: 64,
              width: 64,
              borderRadius: 64,
              borderWidth: option == 'Refress' ? 1.5 : 0,
              borderColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={() => {
                setOption('Refress');
                NavigationService.navigate('PodcastLive', {host: true});
              }}
              style={{
                height: 54,
                width: 54,
                borderRadius: 54,
                backgroundColor:
                  option == 'Refress'
                    ? 'rgba(255, 255, 255, 0.98)'
                    : 'rgba(28, 28, 28, 0.54)',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: option == 'Refress' ? 2 : 0,
                borderColor: '#fff',
              }}>
              <RefressIcon Color={option == 'Refress' ? '#000' : '#fff'} />
            </Pressable>
          </Pressable>
        </Pressable>
      ) : null}

      <Pressable
        style={{
          borderRadius: 100,
          position: 'absolute',
          bottom: 20,
          height: 53,
          width: 350,
          alignSelf: 'center',
          backgroundColor: 'rgba(28, 28, 28, 0.82)',
        }}>
        <FlatList
          data={['Publication', 'Live', 'Podcast']}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            paddingTop: 0,
            paddingHorizontal: 5,
            alignItems: 'center',
          }}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={index}
                onPress={() => setCat(item)}
                style={{
                  height: 45,
                  width: 110,
                  borderRadius: 30,
                  //   borderColor: 'rgba(255, 255, 255, 0.12)',
                  //   borderWidth: 1.5,
                  backgroundColor:
                    cat == item ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: cat == item ? '#fff' : 'rgba(255, 255, 255, 0.54)',
                    fontSize: 16,
                    fontFamily: Theme.FontFamily.normal,
                    // marginTop:5
                  }}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </Pressable>
    </View>
  );
};

export default PublicationIndex;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    alignItems: 'center',
    paddingLeft: 5,
    // backgroundColor: 'rgba(27, 27, 27, 0.96)',
  },
  input_container_sty: {
    paddingHorizontal: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0,
    width: 350,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    marginTop: 20,
    // padding:0
    // backfaceVisibility:'hidden'
    // elevation:3
  },
  text_style: {
    fontFamily: Theme.FontFamily.normal,
    width: '100%',
    fontSize: 15,
    color: '#fff',
  },
  upload: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 350,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  upload_text: {
    fontFamily: Theme.FontFamily.normal,
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
  },
  upload_btn: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

//   <BlurView
//   style={{
//     height: 53,
//     width: 345,
//     // alignItems:'center',
//     alignSelf: 'center',
//   backgroundColor:'#1C1C1C'
//   }}
//   blurType="dark"
//   overlayColor="transparent"
//   blurAmount={20}
//   blurRadius={10}
//   borderRadius={20}
//   reducedTransparencyFallbackColor="grey">

//   </BlurView>
