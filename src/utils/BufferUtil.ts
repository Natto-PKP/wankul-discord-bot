export default class BufferUtil {
  static stringToBuffer(str: string) {
    return Buffer.from(str, 'utf8');
  }

  static bufferToString(buffer: Buffer) {
    return buffer.toString('utf8');
  }
}
