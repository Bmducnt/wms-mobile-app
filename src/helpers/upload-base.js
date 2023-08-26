import mime from "mime";
import AsyncStorage from '@react-native-community/async-storage';
import {
    getRealPath
} from 'react-native-compressor';
import { API_UPLOAD_IMAGES } from "../services/endpoints";

export const serviceUploadAsset = async (assetPath,codeScan,noteUpload,typeUpload,is_avarta,is_selected) => {
    const staffToken = await AsyncStorage.getItem("staff_token");
    var formData = new FormData();
    var fileType = mime.getType(assetPath)
    var realPath = await getRealPath(assetPath,fileType);
    formData.append("file", {
        uri: realPath,
        name: assetPath.split("/").pop(),
        type: fileType,
    });
    formData.append(
        "data",
        JSON.stringify({
          code_scan: codeScan,
          code_note : noteUpload,
          is_tracking: typeUpload,
          is_avarta: is_avarta,
          is_damaged : is_selected
        })
    );
    return fetch(API_UPLOAD_IMAGES, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data;",
          'Accept':'application/json',
          'Authorization': staffToken,
        },
    }).then((res) => res.json());
};