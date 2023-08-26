import * as React from 'react';
import PropTypes from 'prop-types';
import { 
  Animated,
  ActivityIndicator,
  View,
  Text,
  StatusBar
} from 'react-native';
import { 
  device, 
  gStyle,
  images,
  colors
} from '../../constants';

import ScreenHeader from '../../components/ScreenHeader';

import RuleItems  from './RuleItems';

import BySellerConfig from "./BySellerConfig";
import BySourceConfig from "./BySourceConfig";
import BySLAconfig from "./BySLAconfig";
import ByVasConfig from './ByVasConfig';
import ByCarrierConfig from './ByCarrierConfig';

import getListRulePickup from "../../services/pickup/list-rule";

const PickupRules = ({navigation,screenProps}) => {
    const { t} = screenProps;

    const [openSellerConfig, setopenSellerConfig] = React.useState(false);
    const [openSLA, setopenSLA] = React.useState(false);
    const [openSource, setopenSource] = React.useState(false);
    const [openVas, setopenVas] = React.useState(false);
    const [openCarrier, setopenCarrier] = React.useState(false);

    const [bySeller, setbySeller] = React.useState(0);
    const [byVas, setbyVas] = React.useState(false);
    const [byCarrier, setbyCarrier] = React.useState(0);
    const [bySla, setbySla] = React.useState(0);
    const [bySource, setbySource] = React.useState(0);


    fetchListRules = async () => {
        const response = await getListRulePickup({});
        
        if (response?.status === 200) {
          const ruleValues = {
            by_email: setbySeller,
            by_sla: setbySla,
            by_carrier: setbyCarrier,
            by_vas: setbyVas,
            by_source: setbySource,
          };
          
          response?.data?.results.forEach((result) => {
            const setValue = ruleValues[result?.key];
            if (setValue) {
              setValue(result?.value);
            }
            
          });
        }
    };


    React.useEffect( () => {
        fetchListRules();
    }, []);

    return (
        <View style={gStyle.container}>
            <ScreenHeader title={t('screen.module.pickup_rule.btn_add')} bgColor={colors.cardLight} textAlign={"center"} showBack={true} />
            <Animated.ScrollView
                    style={[gStyle.container,{flex: 1,
                    paddingTop: StatusBar.currentHeight,
                    marginHorizontal:15}]}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
            >
                <View style={{marginVertical : 5}}>
                    <Text style={{...gStyle.textBoxme22,color : colors.white}}>{t('screen.module.pickup_rule.note')}</Text>
                    <Text style={{...gStyle.textBoxme14,color : colors.greyInactive,paddingTop:10}}
                    >{t('screen.module.pickup_rule.title')}</Text>
                </View>
                <Text style={{marginTop:5,color:colors.white,...gStyle.textBoxme16}}>{t('screen.module.pickup_rule.by_seller_text1')}</Text>
                <Text style={{color:colors.greyInactive,marginVertical:4}}>{t('screen.module.pickup_rule.by_seller_text2')}</Text>

                <RuleItems  
                    icon={"user"}
                    textRule={t('screen.module.pickup_rule.by_seller')}
                    textRuleActive={`${t('screen.module.pickup_rule.have')} ${bySeller} ${t('screen.module.pickup_rule.by_seller_sub')}`}
                    iconColor= {colors.boxmeBrand}
                    ruleType={'by_email'}
                    onPressConfig ={setopenSellerConfig}
                />
                <Text style={{marginTop:8,color:colors.white,...gStyle.textBoxme16}}>{t('screen.module.pickup_rule.by_seller_text3')}</Text>
                <Text style={{color:colors.greyInactive,marginVertical:4}}>{t('screen.module.pickup_rule.by_seller_text4')}</Text>
                <RuleItems  
                    icon={"home"}
                    textRule={t('screen.module.pickup_rule.by_source')}
                    textRuleActive={`${t('screen.module.pickup_rule.have')} ${bySource} ${t('screen.module.pickup_rule.by_source_sub')}`}
                    iconColor= {colors.darkgreen}
                    ruleType={'by_source'}
                    onPressConfig ={setopenSource}

                />

                <RuleItems  
                    icon={"paper-plane"}
                    textRule={t('screen.module.pickup_rule.by_carrier')}
                    textRuleActive={`${t('screen.module.pickup_rule.have')} ${byCarrier} ${t('screen.module.pickup_rule.by_carrier')}`}
                    iconColor= {colors.darkgreen}
                    ruleType={'by_carrier'}
                    onPressConfig ={setopenCarrier}

                />


                <RuleItems  
                    icon={"calendar"}
                    textRule={t('screen.module.pickup_rule.by_sla')}
                    textRuleActive={`${t('screen.module.pickup_rule.have')} ${bySla} ${t('screen.module.pickup_rule.by_sla')}`}
                    iconColor= {colors.lightPurple}
                    ruleType={'by_sla'}

                    onPressConfig ={setopenSLA}

                />

                <RuleItems  
                    icon={"present"}
                    textRule={t('screen.module.pickup_rule.by_vas')}
                    textRuleActive={byVas > 0  ? t('screen.module.pickup_rule.by_vas_active'): t('screen.module.pickup_rule.by_vas_deactive')}
                    iconColor= {colors.lightGreen}
                    ruleType={'by_vas'}

                    onPressConfig ={setopenVas}

                />


            </Animated.ScrollView>
            {openSellerConfig && <BySellerConfig  onClose={setopenSellerConfig} navigation={navigation} t={t} onReload ={fetchListRules} />}
            {openSource && <BySourceConfig onClose={setopenSource} navigation={navigation} t={t} onReload ={fetchListRules}/> }
            {openSLA && <BySLAconfig onClose={setopenSLA} navigation={navigation} t={t} onReload ={fetchListRules}/> }
            {openVas && <ByVasConfig onClose={setopenVas} navigation={navigation} t={t} onReload ={fetchListRules}/> }
            {openCarrier && <ByCarrierConfig onClose={setopenCarrier} navigation={navigation} t={t}onReload ={fetchListRules} /> }
            
        </View>
    )
};


PickupRules.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

export default PickupRules;
