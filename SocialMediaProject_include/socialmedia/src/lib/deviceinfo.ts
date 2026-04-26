import { UAParser } from 'ua-parser-js';

export function getDeviceType(userAgent:string) : string {

    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const cpu = parser.getCPU();

    let deviceType = 'desktop';
    if (device.type === 'mobile') deviceType = 'mobile';
    else if (device.type === 'tablet') deviceType = 'tablet';
    else {
      if (cpu.architecture === 'amd64') deviceType = 'desktop';
      else deviceType = 'laptop';
    }

    return deviceType ;
}