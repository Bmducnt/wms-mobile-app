import React, { useRef,memo } from "react";
import {
    View,
    Text
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { colors, gStyle } from "../../constants";

const DropdownOption = props => {

    const [dataSelect, setdataSelect] = React.useState(props.data);

    return (
        <View style={{ flex: 1,backgroundColor:colors.cardDark,borderRadius:6}}>
            <SelectList 
                setSelected={(val) => props.onSelect(val)} 
                data={dataSelect} 
                save="value"
                placeholder={props.placeholder}
                inputStyles={{
                    backgroundColor:colors.whiteBg,
                    
                }}
                boxStyles ={{
                    backgroundColor:colors.whiteBg,
                    borderRadius:6
                }}
                dropdownStyles = {{
                    backgroundColor:colors.whiteBg,
                    borderRadius:6
                }}
            />
        </View>
    )
}
export default memo(DropdownOption);
