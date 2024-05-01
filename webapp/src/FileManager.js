import React, { useState, useEffect } from 'react';
import { CloudDownload, Trash } from 'react-bootstrap-icons';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  console.log('FileManager created');

  // Function to fetch files from the server
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://192.168.178.31:5000/files');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Sort files by creation date
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFiles(data);
    } catch (error) {
      console.error('There was a problem fetching files:', error);
    }
  };

  // Function to handle file download
  const downloadFile = async (filename) => {
    try {
      const response = await fetch(`http://192.168.178.31:5000/download/${filename}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('There was a problem downloading the file:', error);
    }
  };

  // Function to handle file deletion
  const deleteFile = async (filename) => {
    try {
      const response = await fetch(`http://192.168.178.31:5000/delete/${filename}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Refresh the list of files after deletion
      fetchFiles();
    } catch (error) {
      console.error('There was a problem deleting the file:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []); // Fetch files on initial render

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-4">PDF Manager</h2>
      <button className="btn btn-primary mb-3" onClick={fetchFiles}>Refresh</button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Created on</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.name}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>
                <button className="btn btn-link me-2" onClick={() => downloadFile(file.name)}>
                  <CloudDownload size={24} />
                </button>
                <button className="btn btn-link" onClick={() => deleteFile(file.name)}>
                  <Trash size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileManager;
