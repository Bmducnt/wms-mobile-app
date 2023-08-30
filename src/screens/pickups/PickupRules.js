import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  Text,
  StatusBar
} from 'react-native';
import {
  gStyle,
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
import {translate} from "../../i18n/locales/IMLocalized";

const PickupRules = ({navigation}) => {

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


    const fetchListRules = async () => {
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
            <ScreenHeader title={translate('screen.module.pickup_rule.btn_add')} bgColor={colors.cardLight}
                          textAlign={"center"} showBack={true}  navigation={navigation}/>
            <Animated.ScrollView
                    style={[gStyle.container,{flex: 1,
                    paddingTop: StatusBar.currentHeight,
                    marginHorizontal:15}]}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
            >
                <View style={{marginVertical : 5}}>
                    <Text style={{...gStyle.textBoxme22,color : colors.white}}>{translate('screen.module.pickup_rule.note')}</Text>
                    <Text style={{...gStyle.textBoxme14,color : colors.greyInactive,paddingTop:10}}
                    >{translate('screen.module.pickup_rule.title')}</Text>
                </View>
                <Text style={{marginTop:5,color:colors.white,...gStyle.textBoxme16}}>{translate('screen.module.pickup_rule.by_seller_text1')}</Text>
                <Text style={{color:colors.greyInactive,marginVertical:4}}>{translate('screen.module.pickup_rule.by_seller_text2')}</Text>

                <RuleItems
                    icon={"user"}
                    textRule={translate('screen.module.pickup_rule.by_seller')}
                    textRuleActive={`${translate('screen.module.pickup_rule.have')} ${bySeller} ${translate('screen.module.pickup_rule.by_seller_sub')}`}
                    iconColor= {colors.boxmeBrand}
                    ruleType={'by_email'}
                    onPressConfig ={setopenSellerConfig}
                />
                <Text style={{marginTop:8,color:colors.white,...gStyle.textBoxme16}}>{translate('screen.module.pickup_rule.by_seller_text3')}</Text>
                <Text style={{color:colors.greyInactive,marginVertical:4}}>{translate('screen.module.pickup_rule.by_seller_text4')}</Text>
                <RuleItems
                    icon={"home"}
                    textRule={translate('screen.module.pickup_rule.by_source')}
                    textRuleActive={`${translate('screen.module.pickup_rule.have')} ${bySource} ${translate('screen.module.pickup_rule.by_source_sub')}`}
                    iconColor= {colors.darkgreen}
                    ruleType={'by_source'}
                    onPressConfig ={setopenSource}

                />

                <RuleItems
                    icon={"paper-plane"}
                    textRule={translate('screen.module.pickup_rule.by_carrier')}
                    textRuleActive={`${translate('screen.module.pickup_rule.have')} ${byCarrier} ${translate('screen.module.pickup_rule.by_carrier')}`}
                    iconColor= {colors.darkgreen}
                    ruleType={'by_carrier'}
                    onPressConfig ={setopenCarrier}

                />


                <RuleItems
                    icon={"calendar"}
                    textRule={translate('screen.module.pickup_rule.by_sla')}
                    textRuleActive={`${translate('screen.module.pickup_rule.have')} ${bySla} ${translate('screen.module.pickup_rule.by_sla')}`}
                    iconColor= {colors.lightPurple}
                    ruleType={'by_sla'}

                    onPressConfig ={setopenSLA}

                />

                <RuleItems
                    icon={"present"}
                    textRule={translate('screen.module.pickup_rule.by_vas')}
                    textRuleActive={byVas > 0  ? translate('screen.module.pickup_rule.by_vas_active'): translate('screen.module.pickup_rule.by_vas_deactive')}
                    iconColor= {colors.lightGreen}
                    ruleType={'by_vas'}

                    onPressConfig ={setopenVas}

                />


            </Animated.ScrollView>
            {openSellerConfig && <BySellerConfig  onClose={setopenSellerConfig} navigation= {navigation} onReload = {fetchListRules} />}
            {openSource && <BySourceConfig onClose={setopenSource} navigation={navigation} onReload ={fetchListRules}/> }
            {openSLA && <BySLAconfig onClose={setopenSLA} navigation={navigation} onReload = {fetchListRules}/> }
            {openVas && <ByVasConfig onClose={setopenVas} navigation={navigation} onReload = {fetchListRules}/> }
            {openCarrier && <ByCarrierConfig onClose={setopenCarrier} navigation={navigation} onReload = {fetchListRules} /> }

        </View>
    )
};


PickupRules.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,

};

export default PickupRules;
