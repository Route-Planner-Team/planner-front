import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet, View, ScrollView, Dimensions, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useTheme, Chip, List, Avatar, IconButton, Button, Menu, Divider} from 'react-native-paper'
import Animated, {useSharedValue, useDerivedValue, useAnimatedStyle} from 'react-native-reanimated';
import BottomSheet, {BottomSheetView, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import RouteCustomFooter from "../components/RouteCustomFooter";
import polyline from '@mapbox/polyline';
import Modal from "react-native-modal";


//test
const test_response = 
{
  "0": {
      "coords": [
          {
              "latitude": 52.4079411,
              "longitude": 16.9185578,
              "name": "Święty Marcin 80/82, 61-809 Poznań, Poland",
              "location_number": 0,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.412086,
              "longitude": 16.9547663,
              "name": "Gdańska 2, 61-122 Poznań, Poland",
              "location_number": 1,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.3633098,
              "longitude": 16.9368732,
              "name": "świętego Antoniego 61, 61-359 Poznań, Poland",
              "location_number": 2,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4202831,
              "longitude": 16.9953885,
              "name": "Kępa 1, 61-021 Poznań, Poland",
              "location_number": 3,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4435371,
              "longitude": 16.9473386,
              "name": "Dworska 1, 61-619 Poznań, Poland",
              "location_number": 4,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.3824188,
              "longitude": 16.994769,
              "name": "Szwajcarska 14, 61-285 Poznań, Poland",
              "location_number": 5,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4079411,
              "longitude": 16.9185578,
              "name": "Święty Marcin 80/82, 61-809 Poznań, Poland",
              "location_number": 6,
              "visited": null,
              "comment": null
          }
      ],
      "completed": false,
      "distance_km": 42.85,
      "duration_hours": 2.106666666666667,
      "fuel_liters": 3.281424,
      "polyline": "a}z~HsfgfBiAQgCg@kB]iDmAiEyBo@i@kAu@kC{CwC}Dy@sAPy@tAgDVaAvF}Zf@aEr@{J|@_IPaC@yAIoBa@wEAkAHqAzAuNP{CDiEPeB~@eEfAyERkBDkBAcB[aMCeCEeA_@eFmA_V@yBv@_Jz@eGDu@BAPm@Dk@@qAOYa@U[CQFMn@Et@@f@BJCfFEx@Y~CiH{D_@SElBDmBc@a@y@eA}@yAw@cAEk@Bm@@GdC}Bt@_@|@O~@Hb@Lp@d@pAjAb@j@v@`BPl@TVTFXC`C`AlFfDfD`CpAr@dC|@f@JhB@fBEhBUvDcAh@Yh@Kr@CjARpAh@bNzIjAn@r@VrA`@tExBlBlA|Az@Zd@Rf@P~@Td@^V`@BfA[d@@bCr@lHzD~CnAvGhDbBp@tMlEdKvD`JbExCbAhHz@dAd@j@\\dEjBrBPdBBtARbB|@f@\\vXlZtSfUjJrJtFdGzJjKfDnDjAkKzFuj@uE~c@_NKk@DUJgAjAiAiAoJeKmGqGig@ij@iCoC]u@Y}@KOaD{BiDoB_@QeAUkAT_AV}@@}Da@wBa@aDaAyKwEkMsEqOwFaGwCqBoAyImEgAy@SU[s@Oy@Oa@UUWMg@@a@RCFo@FqA[oCoAuHuD_Am@uAi@iBs@gC{AmAy@}BqAsB{@s@QoAIcARwF`Bo@H}BD{BOs@MsAk@qEwCsBsAiAs@u@m@kAiBgAqBa@U[CQFIO[Q{@WqB_BqAe@}@A{@Ng@VcA~@eB|AoAn@y@N]BMEiA?mAc@y@c@yDoCmJmH{CkCeDsDx@gCLaA@_AIuCGc@QsKUwJOgAa@eAcDwHcBsDYy@Q}@yC{W_@wD]iL{Cag@e@qH@k@YaDSqE]mFQiAqB{IIO{BuKbBwA`DgBfDiD~BwApAe@n@O^@^Nd@^v@lAVC`Be@aBd@WBw@mAs@i@_@G]@cBh@a@RoBlAgDhDaDfBcBvAzBtKNvA`BxHNxAdArPNb@xDln@ZdJHhCgBqA{CgB_EoBc@MOGY[YOeA_@gEkA[tGGt@o@~Ry@nS{@pUMjAU`AaAbCaErFiDlFmFrHiHxK_D~EuHfLcBtBcBdBsGpFkDvCcBlB}AvByAhCgAbCkBjFg@|@SXSHmAdAi@He@IcBq@C]MQQ?IHm@SYUy@]kC]E~@]xFn@]ZV[Wo@\\`@gH@Q~Cb@d@VXTDLZb@B^HNDhAO~KjBa@bEy@V_@DQBQEoAI_B@eAJw@TeAp@}At@wBhCaGxAqCv@eAhBmB~L{Kp@q@vCwDdHcKtG{JlEgGfCqDtBuCfI{Ll@u@f@}@p@{@b@Iv@?xHh@pB^hBp@vBjAzHbG|AtAdBlBtCtDjBnChD|DnD|CnCtBpJxGvAn@pA`@nARtAIb@MtAaAdC}Bt@_@|@O~@Hb@Lp@d@pAjAb@j@v@`BPl@TVTFXC`C`AlFfDfD`CpAr@dC|@f@JhB@fBEhBUvDcADiDjAu[J_BT_Bj@gCtBwH`DkMJy@`@kBpGq]lL}p@hAoF|AwFdAwDP_@p@kCb@}C`@qDrDuV`@wAj@oA~GgK|@}@r@c@v@Y|@M`V{@x@O\\Kr@e@lAqAZo@\\{@vAoF^o@zCmEXQVUPDHRDPIXSVq@`@Ft@dArCvD|JlDaFmD`FxEjM}FhGyAbBjA|DrOxf@t@pCNp@Fn@Bn@AvAWxBOhAM`B?j@DlA?dBCZSz@c@`AaCnDCNoFlH_JzKaQbU[ZwApB}DbF}BpDgBdDqBpE{AfEqBzGaA~DiAfGqBpJqAzF{F~Wy@hA_@Jc@f@Qd@Gr@@x@Jh@@~@EdAm@hDaBvK}A`La@hCs@bGaFz\\e@nDQhB_B~ZmBh]a@nHWfB_@|A[v@c@~@_@z@MCuEfGKZcDnE_E~DkJbJwBfBk@ZuCSeAOU@",
      "user_firebase_id": "TnetpzFwYWYPAX30AqQpAYSTRAr1",
      "email": "mojtestowymail@gmail.com",
      "route_id": "64870c4e758d8934c3323550"
  },
  "1": {
      "coords": [
          {
              "latitude": 52.4079411,
              "longitude": 16.9185578,
              "name": "Święty Marcin 80/82, 61-809 Poznań, Poland",
              "location_number": 0,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.3482883,
              "longitude": 16.8817276,
              "name": "Powstańców Wielkopolskich 79, 61-030 Luboń, Poland",
              "location_number": 1,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4110244,
              "longitude": 16.9027981,
              "name": "Kraszewskiego 9b, 60-501 Poznań, Poland",
              "location_number": 2,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4349532,
              "longitude": 16.9278205,
              "name": "Aleje Solidarności 42, 61-696 Poznań, Poland",
              "location_number": 3,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4592429,
              "longitude": 16.88096,
              "name": "Szarych Szeregów 16, 60-462 Poznań, Poland",
              "location_number": 4,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4124451,
              "longitude": 16.8797228,
              "name": "Szpitalna 27/33, 60-572 Poznań, Poland",
              "location_number": 5,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4268678,
              "longitude": 16.8911164,
              "name": "Warmińska 2, 60-622 Poznań, Poland",
              "location_number": 6,
              "visited": null,
              "comment": null
          },
          {
              "latitude": 52.4079411,
              "longitude": 16.9185578,
              "name": "Święty Marcin 80/82, 61-809 Poznań, Poland",
              "location_number": 7,
              "visited": null,
              "comment": null
          }
      ],
      "completed": false,
      "distance_km": 43.187,
      "duration_hours": 2.0775,
      "fuel_liters": 3.146937,
      "polyline": "a}z~HsfgfBfBfAh@NbAOv@k@p@c@jC_CpMeMr@w@bDoEJ[PZjAr@n@V^gDVkAXw@dBoDd@{AVoANcAt@yLrAhAZWb@@dXtEvGrB`AJzCVpF|@dFbARL~FrB~GfB|P~DfD`B^ZlAXbDbAd@HxLnDjG`ChMdD`Ch@nKlCt@VHP`EvBnStLfBz@|DtAJ@fUxLvF~CzBzApBfBrAzA~BzCvJxNhDpFNd@jCfEzArB~@hA~@n@`DbBvH`D|Al@nBbAfAh@p@b@v@x@|B`D\\XzClEdClCbEjEs@pCUfAElAO|KFv@OxJBlFJxFV`J@pAJzBj@bSGxAGv@b@RFOGPc@Ug@jDqC_AsCu@}GwCMQIWOG_@No@KuVkJkBm@]x@cJzM{AtAo@b@eRfJeCv@gJtC{a@fMoAVuBX[?}Ca@eF_CySmOo@{@gC{Dc@w@a@mAe@e@Wv@Uh@KEs@`AyApC_@|@c@f@]L[CYQu@oAcJ}S}A{D{@gCQY}@vB{@dBs@~AqLrQkBfCc@L]EMEwBkDkCwDuBwC_AeAa@i@iCmCwEoG_B{A}CmBsQqIkC_AqWeI]A{IZmCDKIo@oDsAsKSmAuA_HcGm\\c@oC}@gC]Ua@i@e@YiGgByAi@kF{A{BsAiGuCeBw@kC|SqFuCwAfK_AlFm@lEEn@BPeCxRs@|EMJYr@aB}@oAk@cI}C_H{C{GkCgDmAwFeBeIoCmCsAcAm@qAcAwDcEmMiRkC_EaF}GaBcBgB_B{FeEAUeDgDm@i@Yq@Mk@MqAI_BK{@_AsNeAuQ{@cMU}DIyEDyEReNNiFHoGFeCLUDcAH@HIrBTJK@O^_NObFuCMPyLEg@GYFkD[wAG_@cG_@cDSkBAeCRiCd@aEbB{E|A_ALoF|AMB?nAJlJDtBFn@r@ju@IxKWhQG^SvDEdB?|@OrEEb@D^NRJpAZnBh@zEd@jCt@`DcF`JeAtB_CfFkVp`@k@tA{If[KTy@lCS\\IN?L[z@y@rCAJ{@fCqX`i@}KjTMGIDiFgES[KYeAgFRQSPjAtFP\\tAhAzCfCAVFPLAFSCQ`Q{\\lSq`@z@gCFG~@mC^u@JG@U~@qDD_@zIg[j@uAjVq`@~BgFpAiCvEmI{@uD_@wBi@{ECiEFM|BeApAY`CUnCCzCTxA\\fBt@rGdExEbDrVvOx@l@xCxCxCrDlGxIvGzJfFfH|AhBv@t@pBxAhCtAlBz@lDdAbDhAvDjApI~Ch@NvQxHPPjCrAn@TR`@B\\Cn@c@bESvBkAbK]fCEb@wCnTa@lBK\\`@\\ZJJ?fGlGbJjKdDtDv@{FJG\\LToBUnBa@MIJu@vF_GyGvAqJfCmSDcBdDo\\Fi@sPcIo@OaB}@oAk@cI}C_H{C{GkCgDmAwFeBeIoCmCsAcAm@qAcAg@k@ASsC{DaDkGFcAj@eD`@}AnCgJdA|G^rCJpA|CDCdChFTeAhMb@R@tBEx@o@hHMx@WhAYl@cClCiAx@SZk@nB]|AYhBO`@WTYHb@OT_@RaA\\qBh@qBNc@R[tAgAvB_CXm@ViAXyBf@kG@mAA_Ac@StA}Pd@_FXcBx@uDfGyRt@{Br@{CToA`@aDbCXLNPoAb@yBv@{CHQt@mC|G{T|B}G|BaFx@yAhAgBnBeCHe@?I|DmDr@}@nA_Cz@qBxBfDtBjCxAjAt@Z\\J`ALbFfCzCbA~Dr@f@LhAP",
      "user_firebase_id": "TnetpzFwYWYPAX30AqQpAYSTRAr1",
      "email": "mojtestowymail@gmail.com",
      "route_id": "64870c4e758d8934c3323551"
  }
}


const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

function RouteScreen({ navigation , route}) {

    const response = route.params && route.params.data ? route.params.data : test_response;
    const { colors } = useTheme();
    const mapRef = React.useRef(null);


    //map attributes

    const [mapInUse, setMapInUse] = React.useState(false);
    const depotPoint = response[0].coords[0]
    const [waypoints, setWaypoints] = React.useState([]);
    const setWaypoint = (index) => {
      const polylineData = response[index].polyline;
      const decodedCoordinates = polyline.decode(polylineData);
      const updatedWaypoints = decodedCoordinates.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setWaypoints(updatedWaypoints);
    };
    React.useEffect(() => {
      setWaypoint(0);
    }, []);


    const [currentRegion, setCurrentRegion] = React.useState({
      latitude: depotPoint.latitude, longitude: depotPoint.longitude, latitudeDelta: 0.01, longitudeDelta: 0.1
    });
    const [destinations, setDestinations] = React.useState(response[0].coords);
    const [fuel, setFuel] = React.useState(response[0].fuel_liters);
    const [duration, setDuration] = React.useState(response[0].duration_hours);
    const [distance, setDistance] = React.useState(response[0].distance_km);
    const [currentRouteNumber, setCurrentRouteNumber] = React.useState(0);
    const numberOfRoutes = Object.keys(response).length;
    const changeRoute = (index) => {
      setDestinations(response[index].coords);
      setFuel(response[index].fuel_liters);
      setDuration(response[index].duration_hours);
      setDistance(response[index].distance_km);
      setCurrentRouteNumber(index);
      setWaypoint(index);
    };



    //bottom sheet attributes
    const windowHeight = Dimensions.get('window').height;
    const bottomSheetRef = React.useRef(null);
    const bottomSheetSnapPoints = ['12%', '50%', '90%'];
    const animatedPosition = useSharedValue(0);
    const [isOpen, setIsOpen] = React.useState(true);
    const opacity = useDerivedValue(() => {
      const bottomSheetPos = animatedPosition.value / windowHeight;
      if (bottomSheetPos > 0.12 && bottomSheetPos < 0.14) {
          return -50 * bottomSheetPos + 7;
      } else if (bottomSheetPos > 0.14) {
          return 0;
      } else if (bottomSheetPos < 0.12) {
          return 1;
      }
    });
    const animatedBottomSheetStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });



  //Scroll view attributes
  const scrollViewRef = React.useRef(null);

  const animatedScrollPosition = useSharedValue(0);
  const handleScroll = (event) => {
    const {contentOffset} = event.nativeEvent;
    animatedScrollPosition.value = contentOffset.y;
  };
  const divider = useDerivedValue(() => {
    const scrollPos = animatedScrollPosition.value
    if (scrollPos >= 0 && scrollPos < 50) {
        return 1 /50 * scrollPos
    } else if (scrollPos >= 50) {
        return 1;
    } 
  });
  const animatedScrollStyle = useAnimatedStyle(() => {
    return {
        opacity: divider.value,
    };
  });

  //Modal attributes
  const [modalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  function ModalComponent() {
    return (
      <View>
        <TouchableOpacity onPress={toggleModal}>
          <Text>Open Modal</Text>
        </TouchableOpacity>
        <Modal
          statusBarTranslucent
          isVisible={modalVisible}
          onBackdropPress={toggleModal}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
        >
        <View style={{ backgroundColor: 'white', padding: 16 }}>
          <Text>Route properties</Text>
            <List.Item 
              title={`${Math.round(fuel* 100)/100} liters`}
              left={props => <IconButton icon={'fuel'} size={26}/>}
            >
            </List.Item>
            <List.Item 
              title={`${Math.round(duration* 100)/100} hours`}
              left={props => <IconButton icon={'timer'} size={26}/>}
            >
            </List.Item>
            <List.Item 
              title={`${Math.round(distance* 100)/100} kilometers`}
              left={props => <IconButton icon={'map-marker-distance'} size={26}/>}
            >
            </List.Item>
          </View>
        </Modal>
      </View>
    );
  }


  //Menu attributes
  function MenuComponent() {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<IconButton onPress={openMenu} icon={'dots-vertical'}/>}
      >
        {Array.from({ length: numberOfRoutes }, (_, index) => (
          <Menu.Item 
            key={index}
            onPress={() => {changeRoute(index)}} 
            title={`Route ${index + 1}`} />
        ))}
        
      </Menu>
    );
  }





    return (
        <SafeAreaView style={styles.container}>
            <MapView style={styles.map}
                    customMapStyle={mapStyle}
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    initialRegion={currentRegion}
                    onMapReady={() => setMapInUse(true)}
                    onRegionChange={() => setMapInUse(true)}
                    onRegionChangeComplete={() => setMapInUse(false)}>
                      <Polyline
                        coordinates={waypoints}
                        strokeColor={colors.primary}
                        strokeWidth={3}
                      />
                      {destinations.map((destinations, index) => (
                        <Marker
                            key={index}
                            coordinate={destinations}
                            pinColor={colors.primary}
                      />
                      ))}
            </MapView>

            <Animated.View style={[styles.rectangle, {position: 'absolute', justifyContent: 'flex-end'}, animatedBottomSheetStyle]}>
              <List.Item 
                title={`Route ${currentRouteNumber + 1}`} 
                description={`Total numbers of routes: ${numberOfRoutes}`} 
                right={props => (
                  <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={'information-outline'}  onPress={toggleModal}/>
                    <MenuComponent/>
                  </View>)}
                >
                </List.Item>  
              <Animated.View style={[{width: '100%', height: 0.5, backgroundColor: colors.onSurfaceDisabled}, animatedScrollStyle]}/>
              
            </Animated.View>
            

            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={bottomSheetSnapPoints}
              onClose={() => setIsOpen(false)}
              footerComponent={RouteCustomFooter}
              animatedPosition={animatedPosition}>
            <BottomSheetScrollView 
              onScroll={handleScroll}
              style={{paddingTop: 10}} 
              ref={scrollViewRef} 
              animatedPosition={animatedScrollPosition}>
              
                    {destinations.map((destination, index) => (
                        <List.Item 
                            key={index}
                            title={destination.name.split(', ')[0]}
                            description={destination.name.split(', ').slice(1).join(', ')}
                            left={props =><Avatar.Text size={46} label={index+1} color={colors.tertiary} style={{backgroundColor: colors.tertiaryContainer, marginLeft: '5%',}}/>}
                            >
                        </List.Item>
                        
                        ))}
            </BottomSheetScrollView>
        </BottomSheet>
        <StatusBar style="auto"/>
        <ModalComponent/>
        </SafeAreaView>
      
      
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%'
    },

    headerContainer: {
      zIndex: 3,
      position: 'absolute',
      top: '5%',
    },
    menu: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#FFFBFE',
      width: 56,
      minHeight: 56,
      borderRadius: 28,
    },
    info: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#FFFBFE',
      width: 56,
      minHeight: 56,
      borderRadius: 28,
      marginHorizontal: 5,
    },
    rectangle: {
      width: '100%',
      height: '15%',
      backgroundColor: 'white',
      zIndex: 2,
  },
});

export default RouteScreen;