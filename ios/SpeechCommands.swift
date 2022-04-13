@objc(SpeechCommands)
class SpeechCommands: RCTEventEmitter {
    // MARK: Objects Handling Core Functionality

    private var modelDataHandler: ModelDataHandler? =
        ModelDataHandler(modelFileInfo: ConvActions.modelInfo, labelsFileInfo: ConvActions.labelsInfo, threadCount: 4)
    private var audioInputManager: AudioInputManager?

    // MARK: Instance Variables

    private var result: Result?
    private var bufferSize: Int = 0

    override func supportedEvents() -> [String]! {
        return ["result"]
    }

    /**
     Initializes the AudioInputManager and starts recognizing on the output buffers.
     */
    @objc(startAudioRecognition:withRejecter:)
    private func startAudioRecognition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let handler = modelDataHandler else {
            reject("no_handler", "Speech Commands start failed because modelDataHandler does not exist", nil)
            return
        }

        audioInputManager = AudioInputManager(sampleRate: handler.sampleRate)
        audioInputManager?.delegate = self

        guard let workingAudioInputManager = audioInputManager else {
            reject("no_input", "Speech Commands start failed because audioInputManager does not exist", nil)
            return
        }

        bufferSize = workingAudioInputManager.bufferSize

//        workingAudioInputManager.checkPermissionsAndStartTappingMicrophone()
        workingAudioInputManager.startTappingMicrophone()

        // TODO: maybe it fails still...
        resolve(true)
    }

    /**
     Initializes the AudioInputManager and starts recognizing on the output buffers.
     */
    @objc(stopAudioRecognition:withRejecter:)
    private func stopAudioRecognition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let workingAudioInputManager = audioInputManager else {
            reject("no_input", "Speech Commands stop failed because audioInputManager does not exist", nil)
            return
        }

        workingAudioInputManager.stopTappingMicrophone()

        // TODO: maybe it fails still...
        resolve(true)
    }

    /**
     This method runs hands off inference to the ModelDataHandler by passing the audio buffer.
     */
    private func runModel(onBuffer buffer: [Int16]) {
        result = modelDataHandler?.runModel(onBuffer: buffer)

        if let resultName = result?.recognizedCommand?.name {
            print("result: " + resultName)

            sendEvent(withName: "result", body: resultName)
        }
    }
}

extension SpeechCommands: AudioInputManagerDelegate {
    func didOutput(channelData: [Int16]) {
        guard let handler = modelDataHandler else {
            return
        }

        runModel(onBuffer: Array(channelData[0 ..< handler.sampleRate]))
        runModel(onBuffer: Array(channelData[handler.sampleRate ..< bufferSize]))
    }

    func showPermissionsDeniedAlert() {
        // TODO: message back to react so it can display error
        print("Microphone Permissions Denied")
    }
}

// extension SpeechCommands: RCTEventEmitter {
//    override func supportedEvents() -> [String]! {
//        return ["result"]
//    }
// }
