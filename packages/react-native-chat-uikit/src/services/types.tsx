import type { CameraRoll as MediaLibrary } from '@react-native-camera-roll/camera-roll';
import type Clipboard from '@react-native-clipboard/clipboard';
import type * as Audio from 'react-native-audio-recorder-player';
import type CreateThumbnail from 'react-native-create-thumbnail';
import type * as DocumentPicker from 'react-native-document-picker';
import type FileAccess from 'react-native-file-access';
import { Dirs } from 'react-native-file-access';
import type ImagePicker from 'react-native-image-picker';
import type VideoComponent from 'react-native-video';

import type { Nullable } from '../types';

export type Unsubscribe = () => void | undefined;
export type FileType = {
  uri: string;
  size: number;
  name: string;
  type: string;
  width?: number;
  height?: number;
};

export interface VideoProps {
  source: { uri: string } | number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | undefined;
  onLoad?: () => void | undefined;
}
export interface VideoThumbnailOptions {
  url: string;
  timeMills?: number;
  quality?: number;
}
export interface OpenResult {
  onFailed?: (error: Error) => void;
}
export interface OpenMediaLibraryOptions extends OpenResult {
  selectionLimit?: number;
  mediaType?: 'photo' | 'video' | 'all';
}
export interface OpenCameraOptions extends OpenResult {
  cameraType?: 'front' | 'back';
  mediaType?: 'photo' | 'video' | 'all';
}
export type OpenDocumentOptions = OpenResult;
export interface SaveFileOptions {
  fileUrl: string;
  fileName: string;
  fileType?: string | null;
  basePath?: string | undefined;
}
export interface RecordAudioOptions extends OpenResult {
  url?: string;
  audio: Audio.AudioSet;
  onPosition?: (position: number) => void;
  onFinished?: ({
    result,
    path,
    error,
  }: {
    result: boolean;
    path?: string;
    error?: any;
  }) => void;
}
export interface PlayAudioOptions extends OpenResult {
  url: string;
  opt?: Record<string, string>;
  onPlay?: ({
    isMuted,
    currentPosition,
    duration,
  }: {
    isMuted?: boolean;
    currentPosition: number;
    duration: number;
  }) => void;
  onFile?: (path: string) => void;
}
export type ClipboardServiceOption = {
  clipboard: typeof Clipboard;
};

/**
 * Clipboard service interface.
 *
 * Users can implement the interface by themselves.
 */
export interface ClipboardService {
  setString(text: string): void;
  getString(): Promise<string>;
}
// export interface FileService {}
// export interface AudioService {}
export type MediaServiceOptions = {
  videoModule: typeof VideoComponent;
  videoThumbnail: typeof CreateThumbnail;
  imagePickerModule: typeof ImagePicker;
  documentPickerModule: typeof DocumentPicker;
  mediaLibraryModule: typeof MediaLibrary;
  fsModule: typeof FileAccess;
  audioModule: typeof Audio;
  rootDirName?: string;
};

/**
 * Media service interface.
 *
 * Users can implement the interface by themselves.
 */
export interface MediaService {
  getVideoComponent<Props = {}>(props: VideoProps & Props): JSX.Element;
  getVideoThumbnail(
    options: VideoThumbnailOptions
  ): Promise<string | undefined>;

  openMediaLibrary(
    options?: OpenMediaLibraryOptions
  ): Promise<Nullable<FileType>[]>;
  openCamera(options?: OpenCameraOptions): Promise<Nullable<FileType>>;
  openDocument(options?: OpenDocumentOptions): Promise<Nullable<FileType>>;
  /**
   * **NOTE**: On iOS, You can access the downloaded files by providing options below to info.plist
   * - Supports opening documents in place
   * - Application supports iTunes file sharing
   * @param options save file options.
   */
  save(options: SaveFileOptions): Promise<Nullable<string>>;
  saveFromUrl({
    remoteUrl,
    localPath,
  }: {
    remoteUrl: string;
    localPath: string;
  }): Promise<string>;
  saveFromLocal({
    targetPath,
    localPath,
  }: {
    targetPath: string;
    localPath: string;
  }): Promise<string>;
  saveToAlbum(localPath: string): Promise<string>;

  startRecordAudio(options: RecordAudioOptions): Promise<boolean>;
  stopRecordAudio(): Promise<{ pos: number; path: string } | undefined>;
  playAudio(options: PlayAudioOptions): Promise<boolean>;
  stopAudio(): Promise<void>;
  getRootDir(): string;
  createDir(subDir: string): Promise<string>;
  deleteDir(subDir: string): Promise<void>;
  deleteCustomDir(dir: string): Promise<void>;
  isDir(subDir: string): Promise<boolean>;
  isExistedDir(subDir: string): Promise<boolean>;
  isExistedFile(file: string): Promise<boolean>;
  getDirs(): typeof Dirs;
}
// export interface ImageService {}
// export interface NetworkService {}

/**
 * Local storage service interface.
 *
 * Users can implement the interface by themselves.
 */
export interface LocalStorageService {
  getAllKeys(): Promise<readonly string[]>;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export type DirCacheServiceOption = {
  media: MediaService;
};

/**
 * directory service interface.
 *
 * Users can implement the interface by themselves.
 */
export interface DirCacheService {
  init(useId: string): void;
  unInit(): void;

  getRootDir(): string;
  getUserDir(): string;
  getMessageDir(): string;
  getConversationDir(convId: string): string;
  getFileDir(convId: string, file: string): string;

  isExistedUserDir(): Promise<boolean>;
  isExistedMessageDir(): Promise<boolean>;
  isExistedConversationDir(convId: string): Promise<boolean>;
  isExistedFile(file: string): Promise<boolean>;

  createUserDir(): Promise<string>;
  createMessageDir(): Promise<string>;
  createConversationDir(convId: string): Promise<string>;

  deleteUserDir(): Promise<void>;
  deleteMessageDir(): Promise<void>;
  deleteConversationDir(convId: string): Promise<void>;
}
