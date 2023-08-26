import * as React from "react"
import PropTypes from "prop-types"
import {
	Alert,
	StyleSheet,
	Text,
	ActivityIndicator,
	View,
	TouchableOpacity,
	Dimensions,
	DeviceEventEmitter,
} from "react-native"
import DataWedgeIntents from "react-native-datawedge-intents";
import * as Print from "expo-print"
import * as Device from "expo-device"
import AsyncStorage from '@react-native-community/async-storage';
import {colors, device, gStyle} from "../../constants"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scrollview"

// components
import ScreenHeader from "../../components/ScreenHeader"
import TextInputComponent from "../../components/TextInputComponent"
import {
	_getTimeDefaultFrom,
	_getTimeDefaultTo,
} from "../../helpers/device-height"
import {
	handleSoundScaner,
	permissionDenied,
	handleSoundOkScaner,
} from "../../helpers/async-storage"
import ToastAlert from "../../components/ToastAlert"
//service s
import ModelListTracking from "./ModelListTracking";
import ModelCamera from "./ModelCamera";
import createHandoverAPI from "../../services/handover/create"
import {PDF_QR_PICKUP} from "../../services/endpoints"



class CreatedHandoverList extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			isloading: false,
			tracking_scan: null,
			carrier_logo: null,
			carrier_name: null,
			warehouse_name: null,
			textError: null,
			quantity_scan: 0,
			country_id : 237,
			order_type : 'b2c',
			tracking_approved: null,
			dispatched_code: null,
			handover_type: 2,
			quantity_rollback : 0,
			open_add_tracking : false,
			visible_camera : false,
			visible_tracking : false,
			list_tracking_error :[]
		}
		this._searchCameraBarcode = this._searchCameraBarcode.bind(this)
		this._saveHandover = this._saveHandover.bind(this)
	}

	componentDidMount() {
		const {navigation} = this.props
		this.state.deviceEmitterSubscription = DeviceEventEmitter.addListener(
			"datawedge_broadcast_intent",
			(intent) => {
				this.broadcastReceiver(intent)
			}
		)
		if (Device.osName === "Android") {
			this.registerBroadcastReceiver();
		};
		this.setState({
			carrier_name: navigation.getParam("carrier_name"),
			order_type: navigation.getParam("order_type"),
			carrier_logo: navigation.getParam("carrier_logo"),
			handover_type: navigation.getParam("handover_type"),
			quantity_rollback : navigation.getParam("quantity_rollback"),
			dispatched_code: navigation.getParam("dispatched_code")
				? navigation.getParam("dispatched_code")
				: "",
		});
		this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				if (this.state.order_type === 'b2b' && this.state.tracking_scan){
					this._postOrderHandover(this.state.tracking_scan)
				}
				
			}
		);
		
	}

	componentWillUnmount() {
		this.state.deviceEmitterSubscription.remove();
		this.willFocusSubscription.remove();
	}

	UNSAFE_componentWillMount = async () => {
		const staff_profile = await AsyncStorage.getItem("staff_profile");
		this.setState({
			country_id:JSON.parse(staff_profile).warehouse_id.country_id,
			warehouse_name: JSON.parse(staff_profile).warehouse_id.name,
		})
	}

	sendCommand(extraName, extraValue) {
		var broadcastExtras = {}
		broadcastExtras[extraName] = extraValue
		broadcastExtras["SEND_RESULT"] = this.state.sendCommandResult
		DataWedgeIntents.sendBroadcastWithExtras({
			action: "com.symbol.datawedge.api.ACTION",
			extras: broadcastExtras,
		})
	}

	registerBroadcastReceiver() {
		DataWedgeIntents.registerBroadcastReceiver({
			filterActions: [
				"asia.boxme.wms.ACTION",
				"com.symbol.datawedge.api.RESULT_ACTION",
			],
			filterCategories: ["android.intent.category.DEFAULT"],
		})
	}

	broadcastReceiver(intent) {
		if (
			intent.hasOwnProperty(
				"com.symbol.datawedge.api.RESULT_GET_VERSION_INFO"
			)
		) {
			//  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX
			var versionInfo =
				intent["com.symbol.datawedge.api.RESULT_GET_VERSION_INFO"]
			var datawedgeVersion = versionInfo["DATAWEDGE"]
			//  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
			if (datawedgeVersion >= "6.3") this.datawedge63()
			if (datawedgeVersion >= "6.4") this.datawedge64();
		}

		if (!intent.hasOwnProperty("RESULT_INFO")) {
			//  A barcode has been scanned
			var scannedData = intent["com.symbol.datawedge.data_string"]
			if (scannedData && scannedData !== "") {
				this._postOrderHandover(scannedData)
			};
		}
	}

	datawedge63() {
		//  Create a profile for our application
		this.sendCommand(
			"com.symbol.datawedge.api.CREATE_PROFILE",
			"BoxmeWMS"
		)
		//  Although we created the profile we can only configure it with DW 6.4.
		this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "")
	}

	datawedge64() {
		console.log("Datawedge 6.4 APIs are available")

		//  Documentation states the ability to set a profile config is only available from DW 6.4.
		//  For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
		this.state.dwVersionText = "6.4."
		this.state.dwVersionTextStyle = styles.itemText
		//document.getElementById('info_datawedgeVersion').classList.remove("attention");

		//  Decoders are now available
		this.state.checkBoxesDisabled = false

		//  Configure the created profile (associated app and keyboard plugin)
		var profileConfig = {
			PROFILE_NAME: "BoxmeWMS",
			PROFILE_ENABLED: "true",
			CONFIG_MODE: "UPDATE",
			PLUGIN_CONFIG: {
				PLUGIN_NAME: "BARCODE",
				RESET_CONFIG: "true",
				PARAM_LIST: {},
			},
			APP_LIST: [
				{
					PACKAGE_NAME: "asia.boxme.wms",
					ACTIVITY_LIST: ["*"],
				},
			],
		}
		this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig)

		//  Configure the created profile (intent plugin)
		var profileConfig2 = {
			PROFILE_NAME: "BoxmeWMS",
			PROFILE_ENABLED: "true",
			CONFIG_MODE: "UPDATE",
			PLUGIN_CONFIG: {
				PLUGIN_NAME: "INTENT",
				RESET_CONFIG: "true",
				PARAM_LIST: {
					intent_output_enabled: "true",
					intent_action: "asia.boxme.wms.ACTION",
					intent_delivery: "5",
				},
			},
		}
		this.sendCommand(
			"com.symbol.datawedge.api.SET_CONFIG",
			profileConfig2
		)
		//  Give some time for the profile to settle then query its value
		setTimeout(() => {
			this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "")
		}, 1000)
	}

	_searchCameraBarcode = async (code) => {
		if (code) {
			if (this.state.order_type === 'rma'){
				await this._postOrderHandover(code)
			}else{
				if (this.state.order_type === 'b2b'){
					this.setState({tracking_scan :code})
					this.props.navigation.navigate("ModelHandoverB2B", {"tracking_code" :code})
				}else{
					await this._postOrderHandover(code)
				}
			}
			
		}
	}

	_printQRCode = async (ob_code) => {
		try {
			await Print.printAsync({
				uri:
					PDF_QR_PICKUP +
					ob_code +
					"?quantity=" +
					this.state.quantity_scan,
			})
			this.props.navigation.goBack(null)
		} catch (error) {
			this.props.navigation.goBack(null)
		}
	}

	_saveHandover = async () => {
		const {navigation} = this.props
		const {t} = this.props.screenProps
		Alert.alert(
			"",
			this.state.handover_type === 2
				? t("screen.module.handover.btn_approved_text")
				: t("screen.module.handover.confirm"),
			[
				{
					text:
						this.state.handover_type === 2
							? t("screen.module.handover.btn_approved")
							: t("screen.module.handover.confirm_text"),
					onPress: () =>
						navigation.navigate("SignatureScreenBase", {
							ob_code: this.state.dispatched_code,
							warehouse_name: this.state.warehouse_name,
							carrier_name: this.state.carrier_name,
							quantity: this.state.quantity_scan,
							quantity_rollback :this.state.quantity_rollback,
						}),
				},
				{
					text:
						this.state.handover_type === 2
							? t("screen.module.handover.btn_confirm")
							: t("screen.module.handover.confirm_not_btn"),
					onPress: () =>
						this.state.dispatched_code
							? this._printQRCode(this.state.dispatched_code)
							: navigation.goBack(null),
				},
			],
			{cancelable: false}
		)
	};

	_postOrderHandover = async (code) => {
		this.setState({isloading: true, textError: null,visible_tracking:false})
		const {t} = this.props.screenProps
		const response = await createHandoverAPI({
			tracking_code: code,
			courier_name: this.state.carrier_name,
			courier_logo: this.state.carrier_logo,
			rma_type: this.state.handover_type,
			order_type : this.state.order_type,
			dispatched_code: this.state.dispatched_code,
			v2: 1
		})
		if (response.status === 200) {
			handleSoundOkScaner();
			this.setState({
				quantity_scan: this.state.quantity_scan + 1,
				tracking_approved: code,
				textError:null,
				dispatched_code: response.data.results.dispatched_code,
				isloading: false,
				tracking_scan: null,
			})
			if (response.data.results.is_return) {
				Alert.alert(
					t("screen.module.handover.rma_order"),
					` ${t("screen.module.handover.rma_order_text")} + ${response.data.results.reason_note}`,
					[
						{
							text: t("screen.module.handover.btn_rma_order_text"),
							onPress: () => this.openCamera(true),
						},
					],
					{cancelable: false}
				)
			}
		} else if (response.status === 403) {
			permissionDenied(this.props.navigation)
		} else {
			handleSoundScaner();
			this.setState({tracking_scan: null})
			if (response.data.error === 1) {
				await this.setState({
					textError: t("screen.module.handover.order_fail"),
				})
			} else if (response.data.error === 6) {
				await this.setState({
					textError: t("screen.module.handover.order_fail_carrier"),
				})
			} else if (response.data.error === 4) {
				await this.setState({
					textError: t("screen.module.handover.order_status_fail"),
				})
			} else if (response.data.error === 5) {
				await this.setState({
					textError: t("screen.module.handover.order_status_fail_flow"),
				})
			} else if (response.data.error === 3) {
				await this.setState({
					textError: t("screen.module.handover.order_status_fail_done"),
				})
			}
			else if (response.data.error === 7) {
				await this.setState({
					textError: t("screen.module.handover.order_over_200"),
				})
			}  
			else if (response.data.error === 10) {
				await this.setState({list_tracking_error:response.data.data});
				this.openListTracking(true);
			}
			else {
				await this.setState({
					textError: t("screen.module.handover.order_has_scan"),
				})
			}
		}
		this.setState({isloading: false,})
	}

	openCamera = async (code) =>{
		this.setState({visible_camera : code})
	}

	openListTracking = async (code) =>{
		this.setState({visible_tracking : code})
	}

	render() {
		const {navigation} = this.props
		const {
			isloading,
			quantity_scan,
			tracking_approved,
			tracking_scan,
			textError,
			order_type,
			visible_camera,
			handover_type,
			list_tracking_error,
			visible_tracking,
			country_id
		} = this.state
		const {t} = this.props.screenProps
		return (
			<View style={[gStyle.container]}>
				<View
					style={{
						position: "absolute",
						top: 0,
						width: "100%",
						zIndex: 10,
					}}>
					<ScreenHeader
						title={navigation.getParam("carrier_name")}
						showBack={true}
						textAlign={"center"}
					/>
				</View>
				<KeyboardAwareScrollView
					style={styles.container}
					scrollEnabled={true}
					enableOnAndroid={true}
					showsVerticalScrollIndicator={false}
					enableAutomaticScroll={true}>
					<View style={styles.sectionHeading}>
						<View style={gStyle.flexRow}>
							<View
								style={[
									gStyle.flexCenter,
									{width: Dimensions.get("window").width / 2},
								]}>
								<Text style={styles.textLabel}>
									{t("screen.module.handover.tracking_just_scan")}
								</Text>
								<Text style={styles.textValue}>
									{tracking_approved ? tracking_approved : "N/A"}
								</Text>
							</View>
							<View style={styles.separator}></View>
							<View
								style={[
									gStyle.flexCenter,
									{width: Dimensions.get("window").width / 2},
								]}>
								<Text style={styles.textLabel}>
									{t("screen.module.handover.quantity")}
								</Text>
								<Text style={[styles.textValue]}>{quantity_scan}</Text>
							</View>
						</View>
					</View>
					<View style={{marginTop: 10, marginHorizontal: 10}}>
						<TextInputComponent
							navigation={navigation}
							textLabel={t("screen.module.handover.input_tracking")}
							inputValue={tracking_scan}
							autoFocus={true}
							is_close={handover_type === 2 ? order_type === 'b2c' ? true : false:false}
							textError={textError}
							onPressCamera={this._searchCameraBarcode}
							onSubmitEditingInput={this._searchCameraBarcode}
							textPlaceholder={t(
								"screen.module.handover.input_tracking_placeholder"
							)}
						/>
						{isloading && <ActivityIndicator />}
					</View>
				</KeyboardAwareScrollView>
				{quantity_scan > 0 && (
					<View style={styles.iconRight}>
						<TouchableOpacity
							activeOpacity={gStyle.activeOpacity}
							onPress={() => this._saveHandover()}>
							<Text style={{color: colors.white}}>
								{t("base.confirm")}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				{Device.osName === "Android" && textError && (
					<ToastAlert textAlert={textError} />
				)}
				{visible_camera && <ModelCamera t={t} onClose={this.openCamera} tracking_code ={tracking_approved} country_id = {country_id}/>}
				{visible_tracking && <ModelListTracking t={t} onClose={this.openListTracking} listData ={list_tracking_error} onSelect={this._postOrderHandover}/>}
			</View>
		)
	}
}

CreatedHandoverList.propTypes = {
	// required
	navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40,
	},
	sectionHeading: {
		marginTop: device.iPhoneNotch ? 60 : 30,
		marginHorizontal: 10,
		alignItems: "center",
	},
	textLabel: {
		color: colors.greyInactive,
		...gStyle.textBoxme14,
		marginTop: 10,
	},
	textValue: {
		...gStyle.textBoxmeBold16,
		color: colors.white,
		marginTop: 5,
	},
	separator: {
		borderLeftWidth: 2,
		borderColor: colors.greyInactive,
		height: 20,
		marginTop: 20,
	},
	iconRight: {
		alignItems: "center",
		height: 28,
		justifyContent: "center",
		position: "absolute",
		right: 24,
		top: device.iPhoneNotch ? 50 : 20,
		width: 60,
		zIndex: 100,
	},
})
export default CreatedHandoverList
