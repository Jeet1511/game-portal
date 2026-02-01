/**
 * Test script for MongoDB GridFS storage
 * 
 * This script tests the storage service by:
 * 1. Creating a test file
 * 2. Uploading it to GridFS
 * 3. Downloading it back
 * 4. Verifying the content matches
 * 5. Deleting the file
 * 
 * Usage: npm run test:storage
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8080/api/storage';

// Create a test file
const createTestFile = () => {
    const testContent = 'Hello from GridFS! This is a test file. 🎮';
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, testContent);
    return { path: testFilePath, content: testContent };
};

const testStorage = async () => {
    console.log('🧪 Starting GridFS Storage Test...\n');

    try {
        // Step 1: Create test file
        console.log('📝 Step 1: Creating test file...');
        const testFile = createTestFile();
        console.log('✅ Test file created\n');

        // Step 2: Upload file
        console.log('⬆️  Step 2: Uploading file to GridFS...');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFile.path));

        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
            headers: formData.getHeaders(),
        });

        if (!uploadResponse.data.success) {
            throw new Error('Upload failed');
        }

        const fileId = uploadResponse.data.data.fileId;
        console.log('✅ File uploaded successfully');
        console.log(`   File ID: ${fileId}`);
        console.log(`   Filename: ${uploadResponse.data.data.filename}`);
        console.log(`   Size: ${uploadResponse.data.data.size} bytes\n`);

        // Step 3: Get file metadata
        console.log('📋 Step 3: Getting file metadata...');
        const metadataResponse = await axios.get(`${API_URL}/${fileId}/metadata`);
        console.log('✅ Metadata retrieved:');
        console.log(`   Filename: ${metadataResponse.data.data.filename}`);
        console.log(`   MIME Type: ${metadataResponse.data.data.mimetype}`);
        console.log(`   Size: ${metadataResponse.data.data.size} bytes\n`);

        // Step 4: Download file
        console.log('⬇️  Step 4: Downloading file from GridFS...');
        const downloadResponse = await axios.get(`${API_URL}/${fileId}`, {
            responseType: 'text',
        });

        console.log('✅ File downloaded successfully');
        console.log(`   Content: "${downloadResponse.data}"\n`);

        // Step 5: Verify content
        console.log('🔍 Step 5: Verifying content...');
        if (downloadResponse.data === testFile.content) {
            console.log('✅ Content matches! Upload and download working correctly.\n');
        } else {
            throw new Error('Content mismatch! Downloaded content does not match original.');
        }

        // Step 6: List files
        console.log('📂 Step 6: Listing all files...');
        const listResponse = await axios.get(API_URL);
        console.log(`✅ Found ${listResponse.data.data.length} file(s) in storage\n`);

        // Step 7: Delete file
        console.log('🗑️  Step 7: Deleting file...');
        const deleteResponse = await axios.delete(`${API_URL}/${fileId}`);

        if (deleteResponse.data.success) {
            console.log('✅ File deleted successfully\n');
        } else {
            throw new Error('Delete failed');
        }

        // Step 8: Verify deletion
        console.log('🔍 Step 8: Verifying file was deleted...');
        try {
            await axios.get(`${API_URL}/${fileId}`);
            throw new Error('File still exists after deletion!');
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                console.log('✅ File successfully deleted (404 confirmed)\n');
            } else {
                throw error;
            }
        }

        // Cleanup
        fs.unlinkSync(testFile.path);

        console.log('🎉 All tests passed! GridFS storage is working correctly.\n');
        console.log('✨ Summary:');
        console.log('   ✅ File upload: Working');
        console.log('   ✅ File download: Working');
        console.log('   ✅ File metadata: Working');
        console.log('   ✅ File deletion: Working');
        console.log('   ✅ Content verification: Passed\n');

    } catch (error: any) {
        console.error('❌ Test failed:', error.message);

        if (error.response) {
            console.error('   Response status:', error.response.status);
            console.error('   Response data:', error.response.data);
        }

        process.exit(1);
    }
};

// Run the test
console.log('🚀 MongoDB GridFS Storage Test Suite');
console.log('=====================================\n');
console.log('⚠️  Make sure the server is running on http://localhost:8080\n');

testStorage();
