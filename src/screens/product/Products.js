import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Feather} from '@expo/vector-icons';
import { colors, device, gStyle } from '../../constants';

// components
import EmptySearch from "../../components/EmptySearch";
import ScreenHeader from '../../components/ScreenHeader';
import TouchIcon from '../../components/TouchIcon';
import LineItemProducts from '../../components/LineItemProducts';
import {_getTimeDefaultFrom,_getTimeDefaultTo} from '../../helpers/device-height';
import ModelFilter from './ModelFilter';
// mock
import menuProduct from '../../mockdata/menuProduct.json';

//service api
import getListFnsku from '../../services/products/list';
import ModelGSMaTrix from './ModelGSMaTrix';

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view_by_status: false,
      scrollY: new Animated.Value(0),
      isloading: false,
      page:1,
      code_scan : null,
      is_model : false,
      gx_matrix : false,
      list_fnskus : []
    };
  }

  UNSAFE_componentWillMount = async () =>{
    this._fetchListProductsHandler({
      'from_time': _getTimeDefaultFrom(),
      'to_time': _getTimeDefaultTo(),
      'tab': 'all',
      'page':1,
      'q' : this.props.navigation.getParam("code")
    })
  }


  _checkGS1Value = (code) => {
      gs1Data = code.replace("]d2", "")
      if (parseInt(gs1Data.slice(0, 2)) !== 91 || !gs1Data.includes('37117')) {
        return false;
      }
      return true;
  }
  
  _searchCameraBarcode = async (code) => {
    if (code) {
      await this.setState({code_scan : code})
      if(this._checkGS1Value(code) === false){
        this._fetchListProductsHandler({
          'from_time': _getTimeDefaultFrom(),
          'to_time': _getTimeDefaultTo(),
          'tab': 'all',
          'page':1,
          'q' : code
        })
      }else{
        this._onCloseModelGS1(true);
      }
      
    }
  };

  _onFindGtin  =async (code) => {
    this._onCloseModelGS1(false);
    this._fetchListProductsHandler({
      'from_time': _getTimeDefaultFrom(),
      'to_time': _getTimeDefaultTo(),
      'tab': 'all',
      'page':1,
      'q' : code
    })
  }

  _onRefresh = async () => {
    this.state.page = 1; // increase page by 1
    this._fetchListProductsHandler({
      'from_time': _getTimeDefaultFrom(),
      'to_time': _getTimeDefaultTo(),
      'tab': 'all',
      'page':this.state.page,
    });
  };

  _handleLoadMore = () => {
    if (!this.state.isloading) {
      this.state.page = this.state.page + 1; // increase page by 1
      this._fetchListProductsHandler({
        'from_time': _getTimeDefaultFrom(),
        'to_time': _getTimeDefaultTo(),
        'tab': 'all',
        'page':this.state.page,
      });
    }
  };

  _fetchListProductsHandler = async  (parram) =>{
    this.setState({isloading:true,list_fnskus:[]});
    const response = await getListFnsku(parram);
    if (response.status === 200){
      this.setState({list_fnskus:response.data.results})
    }
    this.setState({isloading:false});
  };

  _filterByTab = async (tab_value,from_time) =>{
    this._onCloseModel(false);
    this._fetchListProductsHandler({
      'from_time':from_time,
      'to_time': _getTimeDefaultTo(),
      'tab': tab_value,
      'page':1
    })
  };

  _onCloseModel = async ( code) =>{
    await this.setState({is_model : code})
  };
  
  _onCloseModelGS1 = async (code) => {
    await this.setState({gx_matrix : code})
  }


  render() {
    const {
      navigation
    } = this.props;
    const {
      list_fnskus,
      isloading,
      is_model,
      gx_matrix,
      code_scan
    } = this.state;
    const { t } = this.props.screenProps;
    return (
      <View style={[gStyle.container]}>
        <View style={{ position: 'absolute', top: 0, width: '100%',zIndex:100}}>
          <ScreenHeader 
            title={t('screen.module.product.list')}
            showBack={true}
            showInput = {true}
            inputValueSend ={null}
            autoFocus={false}
            onPressCamera={this._searchCameraBarcode}
            onSubmitEditingInput= {this._searchCameraBarcode}
            textPlaceholder={t("screen.module.putaway.text_fnsku_code")}
            
          />
          {isloading && 
          <View style={[gStyle.flexCenter,{marginTop:"20%"}]}><ActivityIndicator animating={true}  style={{opacity:1}} color={colors.white} /></View>}
        </View>
        
        <View style={styles.containerScroll}>
          {list_fnskus.length === 0 && !isloading && 
            <EmptySearch t={t}/>}
          {list_fnskus.length > 0 && <FlatList
              onRefresh={() => this._onRefresh()}
              refreshing={isloading}
              data={list_fnskus}
              keyExtractor={({ product_id }) => product_id.toString()}
              renderItem={({ item }) => (
                <LineItemProducts
                  navigation = {navigation}
                  id={item.product_id}
                  fnsku_info={item}
                  trans ={t}
                  disableRightSide={false}
                />
              )}
            />}
        </View>
        <View style={styles.iconRight}>
          <TouchIcon
            icon={<Feather name="filter"  color={colors.white} />}
            iconSize ={20}
            onPress={() => this._onCloseModel(true)}
          />
        </View>
      {is_model && 
          <ModelFilter
              t={t}
              listData={menuProduct}
              onClose = {this._onCloseModel} 
              onSelect = {this._filterByTab}
              from_time = {_getTimeDefaultFrom()}
          >
          </ModelFilter>}
      {gx_matrix && <ModelGSMaTrix text={code_scan} trans={t} onClose={this._onCloseModelGS1} onSubmit = {this._onFindGtin} /> }
      </View>
    );
  }
}

Products.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  containerTitle: {
    marginTop: 50,
    alignItems: 'center'
  },
  containerLoading :{
    marginTop: 50,
  },
  searchInfo: {
    ...gStyle.textBoxme18,
    alignItems: 'center',
    color: colors.white,
    marginBottom: 48
  },
  containerScroll: {
    paddingTop: device.iPhoneNotch? 120:100,
  },
  iconRight: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width:35,
    height:35,
    borderRadius:35/2,
    backgroundColor:colors.transparent,
    top: device.iPhoneNotch ? 68 : 55,
    zIndex:100
  }
});

export default Products;
