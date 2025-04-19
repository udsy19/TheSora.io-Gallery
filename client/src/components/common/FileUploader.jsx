import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const FileUploader = ({ onUpload, multiple = true, accept = "image/*", maxSize = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };
  
  const validateFiles = (fileList) => {
    const validFiles = [];
    const errorMessages = [];
    
    Array.from(fileList).forEach(file => {
      // Check file size (MB)
      if (file.size > maxSize * 1024 * 1024) {
        errorMessages.push(`"${file.name}" exceeds the ${maxSize}MB limit`);
        return;
      }
      
      // Check file type
      if (accept !== "*" && !file.type.match(accept.replace(/\*/g, '.*'))) {
        errorMessages.push(`"${file.name}" is not a supported file type`);
        return;
      }
      
      validFiles.push(file);
    });
    
    return { validFiles, errorMessages };
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const { validFiles, errorMessages } = validateFiles(e.dataTransfer.files);
      
      if (errorMessages.length > 0) {
        setErrors(errorMessages);
      }
      
      if (validFiles.length > 0) {
        handleFiles(validFiles);
      }
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const { validFiles, errorMessages } = validateFiles(e.target.files);
      
      if (errorMessages.length > 0) {
        setErrors(errorMessages);
      }
      
      if (validFiles.length > 0) {
        handleFiles(validFiles);
      }
    }
  };
  
  const handleFiles = (newFiles) => {
    // If not multiple, replace existing files
    const updatedFiles = multiple 
      ? [...files, ...newFiles] 
      : [...newFiles];
    
    setFiles(updatedFiles);
    
    // Initialize progress for new files
    const newProgress = { ...uploadProgress };
    newFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    // Simulate upload progress
    simulateUploadProgress(newFiles);
    
    // Pass files to parent component
    onUpload(updatedFiles);
  };
  
  const simulateUploadProgress = (newFiles) => {
    // This would be replaced with actual upload logic
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          const newProgress = Math.min(currentProgress + 5, 100);
          
          const updated = { ...prev, [file.name]: newProgress };
          
          // If upload complete, clear interval
          if (newProgress >= 100) {
            clearInterval(interval);
          }
          
          return updated;
        });
      }, 200);
    });
  };
  
  const handleRemoveFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileToRemove.name];
      return updated;
    });
  };
  
  const handleClearError = (index) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };
  
  useEffect(() => {
    // Clear errors after 5 seconds
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [errors]);
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const containerVariants = {
    active: {
      backgroundColor: 'rgba(255, 154, 139, 0.1)',
      borderColor: 'var(--color-primary)',
      scale: 1.01,
      transition: { duration: 0.2 }
    },
    inactive: {
      backgroundColor: 'transparent',
      borderColor: 'var(--color-border-secondary)',
      scale: 1,
      transition: { duration: 0.2 }
    }
  };
  
  const fileItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };
  
  const errorItemVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      marginBottom: 8,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      marginBottom: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Container>
      <UploadContainer
        as={motion.div}
        variants={containerVariants}
        animate={isDragging ? 'active' : 'inactive'}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 8L12 3L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 21H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </UploadIcon>
        <UploadText>
          {isDragging 
            ? 'Drop files here' 
            : 'Drag and drop files here or click to select'}
        </UploadText>
        <UploadSubtext>
          {multiple 
            ? `You can upload multiple ${accept.replace('/*', '')} files up to ${maxSize}MB each` 
            : `Upload a single ${accept.replace('/*', '')} file up to ${maxSize}MB`}
        </UploadSubtext>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </UploadContainer>
      
      <AnimatePresence>
        {errors.map((error, index) => (
          <ErrorMessage
            key={`error-${index}`}
            as={motion.div}
            variants={errorItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ErrorText>{error}</ErrorText>
            <ErrorClose onClick={() => handleClearError(index)}>✕</ErrorClose>
          </ErrorMessage>
        ))}
      </AnimatePresence>
      
      {files.length > 0 && (
        <FilesPreview>
          <FilesList>
            <AnimatePresence>
              {files.map((file, index) => (
                <FileItem
                  key={`${file.name}-${index}`}
                  as={motion.div}
                  variants={fileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <FileDetails>
                    <FileTypeIcon>
                      {file.type.startsWith('image/') ? '🖼️' : '📄'}
                    </FileTypeIcon>
                    <FileInfo>
                      <FileName>{file.name}</FileName>
                      <FileSize>{formatFileSize(file.size)}</FileSize>
                    </FileInfo>
                  </FileDetails>
                  <ProgressSection>
                    <ProgressBar>
                      <ProgressFill 
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      />
                    </ProgressBar>
                    <ProgressActions>
                      <ProgressText>
                        {uploadProgress[file.name] === 100 
                          ? 'Complete' 
                          : `${uploadProgress[file.name] || 0}%`}
                      </ProgressText>
                      <RemoveButton onClick={() => handleRemoveFile(file)}>
                        ✕
                      </RemoveButton>
                    </ProgressActions>
                  </ProgressSection>
                </FileItem>
              ))}
            </AnimatePresence>
          </FilesList>
        </FilesPreview>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const UploadContainer = styled.div`
  border: 2px dashed var(--color-border-secondary);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary);
    background-color: rgba(255, 154, 139, 0.05);
  }
`;

const UploadIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--color-primary);
`;

const UploadText = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin: 0;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 69, 58, 0.1);
  color: var(--color-status-error);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

const ErrorClose = styled.button`
  background: none;
  border: none;
  color: var(--color-status-error);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;
  margin-left: 0.5rem;
`;

const FilesPreview = styled.div`
  margin-top: 1.5rem;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileItem = styled.div`
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileTypeIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-tertiary);
  border-radius: 8px;
  font-size: 1.25rem;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
`;

const FileSize = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--color-surface-tertiary);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 3px;
  transition: width 0.2s ease;
`;

const ProgressActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem;
  
  &:hover {
    color: var(--color-status-error);
  }
`;

export default FileUploader;