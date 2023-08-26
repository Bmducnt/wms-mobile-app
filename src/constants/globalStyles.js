import colors from './colors';
import fonts from './fonts';
import device from '../constants/device'
import { StatusBar } from 'react-native';
// space grid, some use 8pt grid, some 5pt, this is setting one place then done
const spaceGrid = 8;

export default {
  activeOpacity: 0.7,
  container: {
    backgroundColor: colors.blackBg,
    flex: 1
  },
  containerModel:{
    backgroundColor: '#222222',
    flex: 1
  },
  containerAbsolute: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 50
  },
  shadowBox:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  // flex
  // ///////////////////////////////////////////////////////////////////////////
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexRowCenterAlign: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  flexRowCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  flexRowSpace: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flex4: { flex: 4 },
  flex5: { flex: 5 },

  // navigation styles
  // ///////////////////////////////////////////////////////////////////////////
  navHeaderStyle: {
    backgroundColor: colors.black,
    borderBottomWidth: 0,
    elevation: 0
  },

  // text
  // ///////////////////////////////////////////////////////////////////////////
  textBoxme8: { fontFamily: fonts.regular, fontSize: 8 },
  textBoxme10: { fontFamily: fonts.regular, fontSize: 10 },
  textBoxme12: { fontFamily: fonts.regular, fontSize: 12 },
  textBoxme14: { fontFamily: fonts.regular, fontSize: 14 },
  textBoxme16: { fontFamily: fonts.regular, fontSize: 16 },
  textBoxme18: { fontFamily: fonts.regular, fontSize: 18 },
  textBoxme20: { fontFamily: fonts.regular, fontSize: 20 },
  textBoxme22: { fontFamily: fonts.regular, fontSize: 22 },
  textBoxmeBold10: { fontFamily: fonts.bold, fontSize: 10 },
  textBoxmeBold12: { fontFamily: fonts.bold, fontSize: 12 },
  textBoxmeBold14: { fontFamily: fonts.bold, fontSize: 14 },
  textBoxmeBold16: { fontFamily: fonts.bold, fontSize: 16 },
  textBoxmeBold18: { fontFamily: fonts.bold, fontSize: 18 },
  textBoxmeBold20: { fontFamily: fonts.bold, fontSize: 20 },
  textBoxmeBold22: { fontFamily: fonts.bold, fontSize: 22 },
  textBoxmeBold24: { fontFamily: fonts.bold, fontSize: 24 },
  textBoxmeBold26: { fontFamily: fonts.bold, fontSize: 26 },
  textBoxmeBold28: { fontFamily: fonts.bold, fontSize: 28 },
  textBoxmeBold30: { fontFamily: fonts.bold, fontSize: 30 },
  textBoxmeBold32: { fontFamily: fonts.bold, fontSize: 32 },
  textBoxmeBold34: { fontFamily: fonts.bold, fontSize: 34 },
  textBoxmeBold36: { fontFamily: fonts.bold, fontSize: 36 },
  textBoxmeBold38: { fontFamily: fonts.bold, fontSize: 38 },

  // spacers
  // ///////////////////////////////////////////////////////////////////////////
  spacer1: { height: spaceGrid * 1 },
  spacer2: { height: spaceGrid * 2 },
  spacer3: { height: spaceGrid * 3 },
  spacer4: { height: spaceGrid * 3 },
  spacer6: { height: spaceGrid * 6 },
  spacer8: { height: spaceGrid * 8 },
  spacer11: { height: spaceGrid * 11 },
  spacer16: { height: spaceGrid * 16 },
  spacer24: { height: spaceGrid * 24 },
  spacer48: { height: spaceGrid * 48 },
  spacer64: { height: spaceGrid * 64 },
  spacer88: { height: spaceGrid * 88 },
  spacer128: { height: spaceGrid * 128 },

  spacer1W: { width: spaceGrid * 1 },
  spacer2W: { width: spaceGrid * 2 },
  spacer3W: { width: spaceGrid * 3 },

  // margins
  // ///////////////////////////////////////////////////////////////////////////

  mB1: { marginBottom: spaceGrid },
  mB2: { marginBottom: spaceGrid * 2 },
  mB3: { marginBottom: spaceGrid * 3 },
  mB4: { marginBottom: spaceGrid * 4 },
  mB8: { marginBottom: spaceGrid * 8 },
  mB22: { marginBottom: spaceGrid * 24 },

  mL1: { marginLeft: spaceGrid },
  mL2: { marginLeft: spaceGrid * 2 },
  mL3: { marginLeft: spaceGrid * 3 },
  mL4: { marginLeft: spaceGrid * 4 },

  mR1: { marginRight: spaceGrid },
  mR2: { marginRight: spaceGrid * 2 },
  mR3: { marginRight: spaceGrid * 3 },
  mR4: { marginRight: spaceGrid * 4 },
  mR8: { marginRight: spaceGrid * 8 },
  mR16: { marginRight: spaceGrid * 16 },
  mR24: { marginRight: spaceGrid * 24 },
  mR48: { marginRight: spaceGrid * 48 },
  mR64: { marginRight: spaceGrid * 64 },

  mTHalf: { marginTop: spaceGrid / 2 },
  mT1: { marginTop: spaceGrid },
  mT2: { marginTop: spaceGrid * 2 },
  mT3: { marginTop: spaceGrid * 3 },
  mT4: { marginTop: spaceGrid * 4 },
  mT8: { marginTop: spaceGrid * 8 },
  mT16: { marginTop: spaceGrid * 16 },

  mH1: { marginHorizontal: spaceGrid * 1 },
  mH2: { marginHorizontal: spaceGrid * 2 },
  mH3: { marginHorizontal: spaceGrid * 3 },
  mH4: { marginHorizontal: spaceGrid * 4 },
  mH24: { marginHorizontal: spaceGrid * 24 },

  mV1: { marginVertical: spaceGrid * 1 },
  mV2: { marginVertical: spaceGrid * 2 },
  mV3: { marginVertical: spaceGrid * 3 },
  mV4: { marginVertical: spaceGrid * 4 },
  mV16: { marginVertical: spaceGrid * 16 },
  mV24: { marginVertical: spaceGrid * 24 },
  mV32: { marginVertical: spaceGrid * 32 },

  // paddings
  // ///////////////////////////////////////////////////////////////////////////
  pHalf: { padding: spaceGrid / 2 },
  p1: { padding: spaceGrid },
  p2: { padding: spaceGrid * 2 },
  p3: { padding: spaceGrid * 3 },

  pB1: { paddingBottom: spaceGrid },
  pB2: { paddingBottom: spaceGrid * 2 },
  pB3: { paddingBottom: spaceGrid * 3 },

  pL1: { paddingLeft: spaceGrid },
  pL2: { paddingLeft: spaceGrid * 2 },
  pL3: { paddingLeft: spaceGrid * 3 },

  pR1: { paddingRight: spaceGrid },
  pR2: { paddingRight: spaceGrid * 2 },
  pR3: { paddingRight: spaceGrid * 3 },

  pT1: { paddingTop: spaceGrid },
  pT2: { paddingTop: spaceGrid * 2 },
  pT3: { paddingTop: spaceGrid * 3 },

  pHHalf: { paddingHorizontal: spaceGrid / 2 },
  pH1: { paddingHorizontal: spaceGrid },
  pH2: { paddingHorizontal: spaceGrid * 2 },
  pH3: { paddingHorizontal: spaceGrid * 3 },
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.cardLight,
    top: device.iPhoneNotch ? 57 : 40,
    zIndex: 100,
  },
};
