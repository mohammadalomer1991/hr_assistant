// FileUpload.tsx - React Component with CSS styling
// Import the CSS file: import './FileUpload.css';

import React, { useState, useEffect } from 'react';
import './UploadPageRef.css';

interface UploadedFile {
  name: string;
  size: number;
  s3Key: string;
  s3Url: string;
}

interface SyncJob {
  jobId: string;
  status: string;
}

// Simple icon components (replace with react-icons or lucide-react if preferred)
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning?: boolean }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className={spinning ? 'spin' : ''}
  >
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function FileUploadRef() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [syncJob, setSyncJob] = useState<SyncJob | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [clientId, setClientId] = useState('cli12345ent1qwwwwwwwwwwwwwwwwwwwwww');
  const [dragActive, setDragActive] = useState(false);

  const API_URL = 'http://localhost:3001';

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [clientId]);

  const loadFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/files?clientId=${clientId}`);
      
      const data = await response.json();
      if (response.ok && data.files) {
        setUploadedFiles(data.files.map((f: any) => ({
          name: f.key.split('/').pop(),
          size: f.size,
          s3Key: f.key,
          s3Url: f.url
        })));
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('clientId', clientId);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ File uploaded successfully!');
        setUploadedFiles(prev => [...prev, data.file]);
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Make sure the backend is running on port 3001.');
    } finally {
      setUploading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${API_URL}/api/sync-kb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Knowledge Base sync started!');
        setSyncJob(data.ingestionJob);
        pollSyncStatus(data.ingestionJob.jobId);
      } else {
        alert(`❌ Sync failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('❌ Sync failed. Check console for details.');
    } finally {
      setSyncing(false);
    }
  };

  const pollSyncStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/sync-status/${jobId}`);
        const data = await response.json();

        setSyncJob(data);

        if (data.status === 'COMPLETE' || data.status === 'FAILED') {
          clearInterval(interval);
          alert(`Sync ${data.status}!`);
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(interval);
      }
    }, 5000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        {/* Header */}
        <div className="file-upload-header">
          <div className="file-upload-icon">
            <UploadIcon />
          </div>
          <h1 className="file-upload-title">Bedrock Knowledge Base Upload</h1>
        </div>
        <p className="file-upload-subtitle">
          Upload files to S3 and sync with your Knowledge Base
        </p>



        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`drop-zone ${dragActive ? 'active' : ''}`}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.txt,.doc,.docx,.csv,.json"
            className="file-input-hidden"
          />
          
          <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%' }}>
            <div className="drop-zone-content">
              <div className="drop-zone-icon">
                <FileIcon />
              </div>
              <div>
                <p className="drop-zone-text">
                  Drop your file here or click to browse
                </p>
                <p className="drop-zone-hint">
                  PDF, TXT, DOC, DOCX, CSV, JSON (max 50MB)
                </p>
              </div>
            </div>
          </label>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="selected-file">
              <div className="selected-file-content">
                <div className="selected-file-info">
                  <div className="icon-blue">
                    <FileIcon />
                  </div>
                  <div className="selected-file-details">
                    <p className="selected-file-name">{selectedFile.name}</p>
                    <p className="selected-file-size">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading ? (
                    <>
                      <RefreshIcon spinning />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <h3 className="uploaded-files-header">
              <span className="icon-green">
                <CheckIcon />
              </span>
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="uploaded-files-list">
              {uploadedFiles.slice(-10).reverse().map((file, idx) => (
                <div key={idx} className="file-item">
                  <div className="file-item-info">
                    <div className="icon-gray">
                      <FileIcon />
                    </div>
                    <div className="file-item-details">
                      <p className="file-item-name">{file.name}</p>
                      <p className="file-item-size">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <span className="file-item-key">{file.s3Key}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sync Section */}
        <div className="sync-section">
          <h3 className="sync-title">🔄 Sync with Knowledge Base</h3>
          <p className="sync-description">
            After uploading files, sync them with your Bedrock Knowledge Base to update the vector embeddings.
          </p>
          
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn btn-success"
          >
            {syncing ? (
              <>
                <RefreshIcon spinning />
                Syncing...
              </>
            ) : (
              <>
                <RefreshIcon />
                Sync Knowledge Base
              </>
            )}
          </button>

          {/* Sync Status */}
          {syncJob && (
            <div className={`sync-status ${
              syncJob.status === 'COMPLETE' ? 'complete' :
              syncJob.status === 'FAILED' ? 'failed' :
              'in-progress'
            }`}>
              <div className="sync-status-content">
                <div className={
                  syncJob.status === 'COMPLETE' ? 'icon-green' :
                  syncJob.status === 'FAILED' ? 'icon-red' :
                  'icon-blue'
                }>
                  {syncJob.status === 'COMPLETE' ? <CheckIcon /> :
                   syncJob.status === 'FAILED' ? <AlertIcon /> :
                   <RefreshIcon spinning />}
                </div>
                <div className="sync-status-details">
                  <p className="sync-status-job-id">Job ID: {syncJob.jobId}</p>
                  <p className="sync-status-label">
                    Status: <span className="sync-status-value">{syncJob.status}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}