import AVFoundation
import Foundation

guard CommandLine.arguments.count >= 3 else {
    fputs("Usage: remux-video input.mov output.mp4\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
try? FileManager.default.removeItem(at: outputURL)

let asset = AVURLAsset(url: inputURL)
guard let sourceTrack = asset.tracks(withMediaType: .video).first else {
    fputs("No video track found\n", stderr)
    exit(3)
}

guard let sourceFormatObject = sourceTrack.formatDescriptions.first else {
    fputs("No video format description found\n", stderr)
    exit(4)
}
let sourceFormat = sourceFormatObject as! CMFormatDescription

let reader: AVAssetReader
let readerOutput = AVAssetReaderTrackOutput(track: sourceTrack, outputSettings: nil)
do {
    reader = try AVAssetReader(asset: asset)
    reader.add(readerOutput)
} catch {
    fputs("Unable to create reader: \(error)\n", stderr)
    exit(5)
}

let writer: AVAssetWriter
let writerInput: AVAssetWriterInput
do {
    writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
    writerInput = AVAssetWriterInput(mediaType: .video, outputSettings: nil, sourceFormatHint: sourceFormat)
    writerInput.expectsMediaDataInRealTime = false
    writer.add(writerInput)
} catch {
    fputs("Unable to create writer: \(error)\n", stderr)
    exit(6)
}

guard reader.startReading() else {
    fputs("Unable to start reader: \(reader.error?.localizedDescription ?? "unknown error")\n", stderr)
    exit(7)
}
guard writer.startWriting() else {
    fputs("Unable to start writer: \(writer.error?.localizedDescription ?? "unknown error")\n", stderr)
    exit(8)
}
writer.startSession(atSourceTime: .zero)

while writerInput.isReadyForMoreMediaData {
    guard let sample = readerOutput.copyNextSampleBuffer() else { break }
    if !writerInput.append(sample) {
        fputs("Unable to append video: \(writer.error?.localizedDescription ?? "unknown error")\n", stderr)
        writerInput.markAsFinished()
        writer.cancelWriting()
        exit(9)
    }
}

writerInput.markAsFinished()
let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting { semaphore.signal() }
semaphore.wait()

guard writer.status == .completed else {
    fputs("Remux failed: \(writer.error?.localizedDescription ?? "unknown error")\n", stderr)
    exit(10)
}

print("Wrote \(outputURL.path)")
