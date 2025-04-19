import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const StorageContext = createContext();

export const useStorage = () => useContext(StorageContext);

export const StorageProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Function to upload multiple files to a collection
  const uploadFiles = useCallback(async (files, collectionId) => {
    if (!isAuthenticated) {
      setErrors(['You must be logged in to upload files']);
      return { success: false, errors: ['Authentication required'] };
    }
    
    if (!files || files.length === 0) {
      return { success: false, errors: ['No files to upload'] };
    }
    
    setIsUploading(true);
    
    try {
      // Reset progress for these files
      const initialProgress = {};
      files.forEach(file => {
        initialProgress[file.name] = 0;
      });
      setUploadProgress(initialProgress);
      
      // Create form data with all files
      const formData = new FormData();
      formData.append('collectionId', collectionId);
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Initialize upload progress tracking
      const config = {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          // Update progress for all files
          const updatedProgress = {};
          files.forEach(file => {
            updatedProgress[file.name] = percentCompleted;
          });
          setUploadProgress(prev => ({ ...prev, ...updatedProgress }));
        }
      };
      
      // Make the API call to upload files
      const response = await api.post('/images/upload', formData, config);
      
      // Set all files to 100% complete
      const completedProgress = {};
      files.forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(prev => ({ ...prev, ...completedProgress }));
      
      setIsUploading(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrors([error.message || 'Failed to upload files']);
      setIsUploading(false);
      return { success: false, errors: [error.message] };
    }
  }, [isAuthenticated]);
  
  // Function to get a download URL for a file
  const getDownloadUrl = useCallback(async (fileId) => {
    if (!isAuthenticated) {
      setErrors(['You must be logged in to download files']);
      return { success: false, errors: ['Authentication required'] };
    }
    
    try {
      const response = await api.get(`/images/${fileId}/download`);
      return { success: true, url: response.data.url };
    } catch (error) {
      console.error('Error getting download URL:', error);
      setErrors([error.message || 'Failed to get download URL']);
      return { success: false, errors: [error.message] };
    }
  }, [isAuthenticated]);
  
  // Function to download multiple files as a zip
  const downloadMultipleFiles = useCallback(async (fileIds, zipName = 'download.zip') => {
    if (!isAuthenticated) {
      setErrors(['You must be logged in to download files']);
      return { success: false, errors: ['Authentication required'] };
    }
    
    if (!fileIds || fileIds.length === 0) {
      return { success: false, errors: ['No files to download'] };
    }
    
    try {
      const response = await api.post('/images/download-zip', { fileIds }, { responseType: 'blob' });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', zipName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading files:', error);
      setErrors([error.message || 'Failed to download files']);
      return { success: false, errors: [error.message] };
    }
  }, [isAuthenticated]);
  
  // Function to clear errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  const value = {
    uploadFiles,
    getDownloadUrl,
    downloadMultipleFiles,
    uploadProgress,
    isUploading,
    errors,
    clearErrors
  };
  
  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageContext;