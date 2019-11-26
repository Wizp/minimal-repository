import * as Bluebird from 'bluebird';
import { SetMetadata, createParamDecorator } from '@nestjs/common';
import * as _ from 'lodash';

export interface IFile {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
}

export const FastifyUploadedFiles = createParamDecorator(async (fieldnames: string[], req) => {
  const files = await getRequestFiles(req);
  let picked = {};
  _.map(fieldnames, (fieldname: string) => {
    const file = _.find(files, file => file.fieldname === fieldname);
    if (file) _.assign(picked, { [fieldname]: file });
  });
  return picked;
});

export interface FileUploaderOptions {
  fieldname: string;
  transform?: Transformoptions;
}

interface Transformoptions {
  width?: number;
  height?: number;
}

export const FastifyUploadedFile = createParamDecorator(async (params: FileUploaderOptions, req) => {
  const files = await getRequestFiles(req);
  return _.find(files, file => file.fieldname === params.fieldname);
});

async function getRequestFiles(req) {
  let rawFiles = null;
  if (req.req && req.req.files) rawFiles = req.req.files;
  if (!rawFiles) return rawFiles;
  const files: IFile[] = await Bluebird.all(_.map(rawFiles, async (file, key) => {
    let buffer = file.data;
    let result = {
      fieldname: key,
      originalname: file.name,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.data.length,
      destination: '',
      filename: file.name,
      path: '',
      buffer,
    };
    return result;
  }));
  return files;
}
