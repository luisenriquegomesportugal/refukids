import * as ImagePicker from 'expo-image-picker'
import { useCallback, useState } from 'react'
import { Alert, Linking } from 'react-native'

export function useHandleCamera() {
    const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions()

    return useCallback(async (cbCamera: () => Promise<void>) => {
        if (cameraStatus && cbCamera != undefined) {
            if (
                cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
                (cameraStatus.status === ImagePicker.PermissionStatus.DENIED && cameraStatus.canAskAgain)
            ) {
                const permission = await requestCameraPermission()
                if (permission.granted) {
                    await cbCamera()
                }
            } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
                Alert.alert("Permissão", "Permitir que o aplicativo acesse sua câmera", [
                    {
                        text: "Configurações",
                        isPreferred: true,
                        onPress: async () => await Linking.openSettings()
                    }
                ])
            } else {
                await cbCamera()
            }
        }
    }, [cameraStatus, requestCameraPermission])
}