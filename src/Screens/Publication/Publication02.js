import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useEffect, useCallback, useRef, useState} from 'react';
import ScreenLayout from '../../Components/ScreenLayout/ScreenLayout';
import {useRoute} from '@react-navigation/native';
import NavigationService from '../../Services/Navigation';
import Theme from '../../Constants/Theme';
import GallaryIcon from '../../assets/icons/GallaryIcon';
import {AppTextInput, Icon} from 'react-native-basic-elements';
import {FlatList} from 'react-native';
import VideoPlayIcon from '../../assets/icons/VideoPlayIcon';
import PlaylistIcon from '../../assets/icons/PlayListIcon';
import PlayBackIcon from '../../assets/icons/PlaybackIcon';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import EditProfileIcon from '../../assets/icons/EditProfileIcon';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {postApi} from '../../Services/Service';
import HelperFunctions from '../../Constants/HelperFunctions';
import {useSelector} from 'react-redux';
import axios from 'axios';

const {width, height} = Dimensions.get('screen');

const Publication02 = props => {
  const route = useRoute();
  const {login_status, userDetails, token, deviceid} = useSelector(
    state => state.authData,
  );

  // Access the customProp passed from the source screen
  const {reelDetails} = props.route.params;
  const customProp = route.params?.showButton;
  const [loadingState, changeloadingState] = useState(false);
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [cat, setCat] = useState([]);
  const form = new FormData();
  const [imagesdet, setimagesdet] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState([null]);
  const dropdownController = useRef(null);

  const searchRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [Loder, setLoader] = useState(false);
  const [userLoad, setUserLoader] = useState(false);

  const [followerList, setFollowerList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);
  const fetchCategories = () => {
    setLoader(true);
    let data = {
      limit: '10',
      keyword: '',
      page: null,
    };

    postApi('api/all-category', data, '')
      .then(response => {
        // console.log('response',response)
        if (response?.status == 'success') {
          setCategorylist(response?.data);
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
  const fetchFollowers = () => {
    setUserLoader(true);
    let data = {
      keyword: '',
      status: '',
      page: 0,
      limit: 100,
    };

    postApi('api/list-follower-user', data, token)
      .then(response => {
        console.log('fetchFollowers', response);
        if (response?.status == 'success') {
          setFollowerList(response?.data);
          // setLoader(false)
        } else {
          // setModalVisible(true)
          // setLoader(false)
        }
      })
      .catch(error => {
        HelperFunctions.showToastMsg(error?.message);
        //   setLoader(false)
      })
      .finally(() => {
        //   setLoader(false)
      });
  };

  const handleAddTag = val => {
    if (val.name.trim() !== '') {
      tags.find(res => res._id == val._id)
        ? setTags(tags)
        : setTags([
            ...tags,
            {
              _id: val._id,
              name: val.name,
            },
          ]);
      setSelectedItem(val._id);
      setSelectedItem('');
      setSuggestionsList(null);
    }
  };

  const handleRemoveTag = index => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  const getSuggestions = useCallback(
    async q => {
      const filterToken =
        q != '' && q[0].includes('@')
          ? q.split('@')[1].toLowerCase()
          : q.toLowerCase();
      console.log('getSuggestions', q[1]);
      if (typeof q !== 'string' || q.length < 1) {
        setSuggestionsList(null);
        return;
      } else if (q.split('@')[1] != '' && q[0].includes('@')) {
        console.log('resdpospdosd', followerList);
        // const items =  followerList
        const suggestions = followerList
          .filter(item => item.name.toLowerCase().includes(filterToken))
          .map(item => ({
            _id: item._id,
            name: item.name,
          }));
        setSuggestionsList(suggestions);
        // setUserLoader(false)
      }
    },
    [followerList],
  );

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => {}, []);
  function getOriginalname(data) {
    let arr = data.split('/');
    let lent = Number(arr.length - 1);
    return arr[lent];
  }
  const getPermissionIos = async () => {
    if (Platform.OS === 'ios') {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('MEDIA_LIBRARY', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
      });
    }
  };
  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        // PermissionsAndroid.PERMISSIONS.MEDIA_LIBRARY,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };
  const imageUpload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log('imaher', image);
      let get_originalname = getOriginalname(image.path);

      // form.append('image_for', 'profile_image');
      form.append('image', {
        uri: image.path,
        type: image.mime,
        name: get_originalname,
      });
      setimagesdet(image);
      // console.log('form',form)
      //  if(form!=null && image){
      //   UpdateProfileImage()
      //  }
    });
  };

  const publishReels = () => {
    if (Title == '' || Title == undefined) {
      HelperFunctions.showToastMsg('Please provide title');
    } else if (!imagesdet) {
      HelperFunctions.showToastMsg('Please choose thumbnail image');
    } else if (
      Description == null ||
      Description == undefined ||
      Description?.trim()?.length == 0
    ) {
      HelperFunctions.showToastMsg('Please provide Description');
    } else if (cat.length == 0) {
      HelperFunctions.showToastMsg('Please select any category');
    } else {
      setLoader(true);
      if (imagesdet.path) {
        let get_originalname = getOriginalname(imagesdet.path);

        // form.append('image_for', 'profile_image');
        form.append('thumbnail_image', {
          uri: imagesdet.path,
          type: imagesdet.mime,
          name: get_originalname,
        });
      }
      let get_originalnamevideo = getOriginalname(reelDetails.path);
      form.append('video', {
        uri: reelDetails.path,
        type: 'video/mp4',
        name: get_originalnamevideo,
      });
      form.append('taging', tags);
      form.append('category', cat);
      form.append('title', Title);
      form.append('description', Description);
      form.append('status', 'A');

      postApi('api/create-shorts', form, token, 'multipart/form-data')
        .then(response => {
          // console.log('response',response)
          if (response?.status == 'success') {
            HelperFunctions.showToastMsg(response.message);
            NavigationService.navigate('DrawerNavigation');
            setLoader(false);
          } else {
            HelperFunctions.showToastMsg(response.message);
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
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchFollowers();
  }, []);
  return (
    <ScreenLayout
      headerStyle={{backgroundColor: 'rgba(27, 27, 27, 0.96);'}}
      showLoading={loadingState || Loder}
      isScrollable={true}
      leftHeading={'New Publication'}
      viewStyle={{backgroundColor: '#131313'}}
      // right
      onRightTextPress={() => publishReels()}
      Publish
      leftHeadingStyle={{color: '#E1D01E'}}
      hideLeftIcon={customProp ? false : true}
      onLeftIconPress={() => NavigationService.back()}>
      <Pressable
        onPress={() => dropdownController.current.toggle()}
        style={{...styles.container}}>
        {console.log('reelDetailse>>>>>>>>>>>>', reelDetails)}
        <TouchableOpacity
          onPress={imageUpload}
          style={{
            height: 131,
            width: 131,
            borderRadius: 20,
            backgroundColor: '#1C1C1C',
            marginTop: 45,
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.14)',
            alignSelf: 'center',
          }}>
          <Image
            source={
              imagesdet
                ? {uri: imagesdet.path}
                : require('../../assets/images/addimage.png')
            }
            style={{
              height: imagesdet ? 130 : 80,
              width: imagesdet ? 130 : 80,
              borderRadius: 20,
            }}
            resizeMode="cover"
          />
          {imagesdet ? (
            <TouchableOpacity
              onPress={imageUpload}
              style={{
                height: 28,
                width: 28,
                borderRadius: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: -8,
                right: -8,
              }}>
              <EditProfileIcon />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>

        <AppTextInput
          value={Title}
          onChangeText={a => setTitle(a)}
          placeholder="Title"
          placeholderTextColor={'rgba(255, 255, 255, 0.54)'}
          inputStyle={{fontSize: 14}}
          titleStyle={{
            fontFamily: Theme.FontFamily.semiBold,
            fontSize: Theme.sizes.s15,
          }}
          mainContainerStyle={
            {
              //   marginHorizontal:20
            }
          }
          inputContainerStyle={styles.input_container_sty}
          style={styles.text_style}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            paddingTop: 25,
          }}>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.54)',
              fontSize: 17,
              fontFamily: Theme.FontFamily.normal,
            }}>
            Tags
          </Text>
          <Pressable onPress={() => searchRef.current.focus()} style={{}}>
            <Icon
              name="plus"
              type="Entypo"
              size={25}
              color={'#E1D01E'}
              //   style={{marginTop:5}}
            />
          </Pressable>
        </View>
        {/* {console.log('atag',tags)} */}
        <Pressable
          onPress={() => dropdownController.current.toggle()}
          style={[
            {flex: 1, flexDirection: 'row', alignItems: 'center'},
            Platform.select({ios: {zIndex: 1}}),
          ]}>
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller;
            }}
            // initialValue={'1'}
            direction={Platform.select({ios: 'down', android: 'down'})}
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            onSelectItem={item => {
              item && handleAddTag(item);
            }}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            onClear={onClearPress}
            //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: 'Type @ to search ',
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                borderRadius: 25,
                backgroundColor: 'transparent',
                color: '#fff',
                paddingLeft: 12,
              },
            }}
            rightButtonsContainerStyle={{
              right: 8,
              height: 30,

              alignSelf: 'center',
            }}
            inputContainerStyle={{
              backgroundColor: 'transparent',
              borderRadius: 0,
              borderBottomWidth: 0.7,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#383b42',
            }}
            containerStyle={{flexGrow: 1, flexShrink: 1}}
            renderItem={(item, text) => (
              <Text style={{color: '#fff', padding: 15}}>{item.name}</Text>
            )}
            //   ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
            //   ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
            inputHeight={55}
            showChevron={false}
            closeOnBlur={false}
            //  showClear={false}
          />
          {/* <Pressable style={{ width: 10 }} />
                <Button style={{ flexGrow: 0 }} title="Toggle" /> */}
        </Pressable>
        <FlatList
          data={tags}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{paddingTop: 10, paddingHorizontal: 5}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleRemoveTag(index);
                }}
                style={{
                  height: 32,
                  // width: 65,
                  borderRadius: 10,
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderWidth: 1.5,
                  backgroundColor: '#767680',
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  paddingLeft: 10,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: Theme.FontFamily.normal,
                    // marginTop:5
                  }}>
                  {item.name}
                </Text>
                <Icon
                  name="cross"
                  type="Entypo"
                  size={11}
                  color={'#fff'}
                  style={{position: 'absolute', top: 2, right: 2}}
                />
              </TouchableOpacity>
            );
          }}
        />
        <AppTextInput
          value={Description}
          onChangeText={a => setDescription(a)}
          placeholder="Description"
          placeholderTextColor={'rgba(255, 255, 255, 0.44)'}
          inputStyle={{fontSize: 15}}
          titleStyle={{
            fontFamily: Theme.FontFamily.semiBold,
            fontSize: Theme.sizes.s15,
          }}
          mainContainerStyle={
            {
              //   marginHorizontal:20
            }
          }
          inputContainerStyle={styles.input_container_sty}
          style={styles.text_style}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            paddingTop: 25,
          }}>
          <Text
            style={{
              color: 'rgba(255, 255, 255, 0.54)',
              fontSize: 16,
              fontFamily: Theme.FontFamily.normal,
            }}>
            Categories
          </Text>
          {/* <Pressable
                        // onPress={() => NavigationService.navigate('Publication02')}
                        style={{

                        }}>
                        <Icon
                            name="plus"
                            type="Entypo"
                            size={25}
                            color={'#E1D01E'}
                        //   style={{marginTop:5}}
                        />
                    </Pressable> */}
        </View>
        <FlatList
          data={categorylist}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{paddingVertical: 15, paddingHorizontal: 5}}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  cat.find(res => res._id == item._id)
                    ? setCat(s => s.filter(re => re._id != item._id))
                    : setCat([...cat, item]);
                }}
                style={{
                  height: 40,
                  // width: 65,
                  borderRadius: 10,
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderWidth: 1.5,
                  backgroundColor: cat.find(res => res._id == item._id)
                    ? '#fff'
                    : '#000',
                  marginRight: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                }}>
                <Text
                  style={{
                    color: cat.find(res => res._id == item._id)
                      ? '#000'
                      : '#fff',
                    fontSize: 14,
                    fontFamily: Theme.FontFamily.semiBold,
                    // marginTop:5
                  }}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
        <Pressable
          onPress={() => NavigationService.navigate('FinalPublication')}
          style={{
            // marginTop:30,
            // flexDirection:'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            backgroundColor: 'rgba(255,255,255,0.1)',
            height: 50,
            marginHorizontal: 21,
            borderRadius: 10,
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 20,
            width: width - 60,
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: '30%',
              alignItems: 'center',
            }}>
            <PlayBackIcon Size={24} Color={'#ED4040'} />
            <View
              style={{
                ...styles.text_icon_view,
                marginLeft: 5,
              }}>
              <Text
                style={{
                  ...styles.my_info_txt,
                  color: '#ED4040',
                  fontSize: 15,
                  fontFamily: Theme.FontFamily.medium,
                }}>
                Draft
              </Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </ScreenLayout>
  );
};

export default Publication02;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#131313',
    // height:height
  },
  input_container_sty: {
    paddingHorizontal: 5,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0,
    width: width - 30,
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
  tag: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
});
