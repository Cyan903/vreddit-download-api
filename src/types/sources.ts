export interface Response {
    MPD: Mpd;
}

export interface Mpd {
    $: MPDClass;
    Period: PeriodElement[];
}

export interface MPDClass {
    xmlns: string;
    "xmlns:xsi": string;
    mediaPresentationDuration: string;
    minBufferTime: string;
    profiles: string;
    type: string;
    "xsi:schemaLocation": string;
}

export interface PeriodElement {
    $: Period;
    AdaptationSet: AdaptationSet[];
}

export interface Period {
    duration: string;
}

export interface AdaptationSet {
    $: { [key: string]: string };
    Representation: RepresentationElement[];
}

export interface RepresentationElement {
    $: Representation;
    AudioChannelConfiguration?: AudioChannelConfigurationElement[];
    BaseURL: string[];
    SegmentBase: SegmentBaseElement[];
}

export interface Representation {
    audioSamplingRate?: string;
    bandwidth: string;
    codecs: string;
    id: string;
    frameRate?: string;
    height?: string;
    scanType?: string;
    width?: string;
}

export interface AudioChannelConfigurationElement {
    $: AudioChannelConfiguration;
}

export interface AudioChannelConfiguration {
    schemeIdUri: string;
    value: string;
}

export interface SegmentBaseElement {
    $: SegmentBase;
    Initialization: InitializationElement[];
}

export interface SegmentBase {
    indexRange: string;
    indexRangeExact: string;
    timescale: string;
}

export interface InitializationElement {
    $: Initialization;
}

export interface Initialization {
    range: string;
}
