import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { config } from '../config';

let bucket: GridFSBucket;

/**
 * Initialize GridFS bucket
 * Call this after MongoDB connection is established
 */
export const initializeGridFS = () => {
    if (!mongoose.connection.db) {
        throw new Error('MongoDB connection not established');
    }

    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads', // Collection name prefix
    });

    console.log('✅ GridFS initialized successfully');
};

/**
 * Upload a file to GridFS
 * @param file - File buffer
 * @param filename - Original filename
 * @param mimetype - File MIME type
 * @returns File ID and metadata
 */
export const uploadFile = async (
    file: Buffer,
    filename: string,
    mimetype: string
): Promise<{ fileId: string; filename: string; size: number; mimetype: string }> => {
    if (!bucket) {
        throw new Error('GridFS not initialized');
    }

    // Validate file size
    if (file.length > config.storage.maxFileSize) {
        throw new Error(
            `File size exceeds maximum allowed size of ${config.storage.maxFileSize / 1024 / 1024}MB`
        );
    }

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                mimetype,
                uploadedAt: new Date(),
            },
        });

        const readableStream = Readable.from(file);

        readableStream.pipe(uploadStream);

        uploadStream.on('error', (error) => {
            reject(error);
        });

        uploadStream.on('finish', () => {
            resolve({
                fileId: uploadStream.id.toString(),
                filename: uploadStream.filename,
                size: file.length,
                mimetype,
            });
        });
    });
};

/**
 * Download a file from GridFS
 * @param fileId - File ID
 * @returns Download stream and file metadata
 */
export const downloadFile = async (
    fileId: string
): Promise<{ stream: any; metadata: any }> => {
    if (!bucket) {
        throw new Error('GridFS not initialized');
    }

    try {
        const objectId = new ObjectId(fileId);

        // Get file metadata
        const files = await bucket.find({ _id: objectId }).toArray();

        if (files.length === 0) {
            throw new Error('File not found');
        }

        const file = files[0];
        const downloadStream = bucket.openDownloadStream(objectId);

        return {
            stream: downloadStream,
            metadata: {
                filename: file.filename,
                mimetype: file.metadata?.mimetype || 'application/octet-stream',
                size: file.length,
                uploadedAt: file.metadata?.uploadedAt,
            },
        };
    } catch (error) {
        if (error instanceof Error && error.message === 'File not found') {
            throw error;
        }
        throw new Error('Invalid file ID');
    }
};

/**
 * Delete a file from GridFS
 * @param fileId - File ID
 */
export const deleteFile = async (fileId: string): Promise<void> => {
    if (!bucket) {
        throw new Error('GridFS not initialized');
    }

    try {
        const objectId = new ObjectId(fileId);
        await bucket.delete(objectId);
    } catch (error) {
        throw new Error('Failed to delete file or file not found');
    }
};

/**
 * Get file metadata without downloading
 * @param fileId - File ID
 * @returns File metadata
 */
export const getFileMetadata = async (
    fileId: string
): Promise<{ filename: string; mimetype: string; size: number; uploadedAt: Date }> => {
    if (!bucket) {
        throw new Error('GridFS not initialized');
    }

    try {
        const objectId = new ObjectId(fileId);
        const files = await bucket.find({ _id: objectId }).toArray();

        if (files.length === 0) {
            throw new Error('File not found');
        }

        const file = files[0];

        return {
            filename: file.filename,
            mimetype: file.metadata?.mimetype || 'application/octet-stream',
            size: file.length,
            uploadedAt: file.metadata?.uploadedAt || file.uploadDate,
        };
    } catch (error) {
        if (error instanceof Error && error.message === 'File not found') {
            throw error;
        }
        throw new Error('Invalid file ID');
    }
};

/**
 * List all files (with pagination)
 * @param limit - Number of files to return
 * @param skip - Number of files to skip
 * @returns Array of file metadata
 */
export const listFiles = async (
    limit: number = 50,
    skip: number = 0
): Promise<Array<{ fileId: string; filename: string; size: number; uploadedAt: Date }>> => {
    if (!bucket) {
        throw new Error('GridFS not initialized');
    }

    const files = await bucket.find({}).skip(skip).limit(limit).toArray();

    return files.map((file) => ({
        fileId: file._id.toString(),
        filename: file.filename,
        size: file.length,
        uploadedAt: file.uploadDate,
    }));
};
