import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const WordUploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setError('CSV 또는 TXT 파일만 업로드 가능합니다.');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('[Upload] Starting file upload...');
      console.log('[Upload] File name:', file.name);
      console.log('[Upload] File size:', file.size, 'bytes');
      console.log('[Upload] File type:', file.type);

      const response = await api.post('/admin/upload_words', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: function (status) {
          return status < 500; // 500 미만의 상태 코드는 에러로 처리하지 않음
        }
      });

      console.log('[Upload] Response:', response);

      if (response.status === 422) {
        // 422 에러의 경우 상세 에러 메시지 표시
        if (response.data.details && Array.isArray(response.data.details)) {
          setError(
            <div>
              <p>파일 처리 중 다음과 같은 문제가 발생했습니다:</p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                {response.data.details.map((error, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{error}</li>
                ))}
              </ul>
              {response.data.duplicates && response.data.duplicates.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p>중복된 단어 ({response.data.duplicates.length}개):</p>
                  <p style={{ fontSize: '0.9em', color: '#666' }}>
                    {response.data.duplicates.join(', ')}
                  </p>
                </div>
              )}
            </div>
          );
        } else {
          setError(response.data.error || '파일 처리 중 오류가 발생했습니다.');
        }
      } else if (response.status === 200) {
        setResult({
          success: true,
          message: response.data.message,
          duplicates: response.data.duplicates,
        });
      } else {
        throw new Error('업로드 실패');
      }
    } catch (err) {
      console.error('[Upload] Error:', err);
      console.error('[Upload] Error response:', err.response);
      setError(err.response?.data?.error || '업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#1E2A3A', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, backgroundColor: '#17202C', borderRadius: '20px' }}>
          <Typography
            variant="h5"
            sx={{ color: '#FFFFFF', mb: 3, textAlign: 'center' }}
          >
            단어 업로드
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: '#FFFFFF', mb: 1 }}>
              파일 형식 (CSV 또는 TXT):
            </Typography>
            <Typography
              sx={{ color: '#9b87f5', fontSize: '0.9rem', fontFamily: 'monospace' }}
            >
              english,korean
            </Typography>
            <Typography
              sx={{ color: '#9b87f5', fontSize: '0.9rem', fontFamily: 'monospace' }}
            >
              apple,사과
            </Typography>
            <Typography
              sx={{ color: '#9b87f5', fontSize: '0.9rem', fontFamily: 'monospace' }}
            >
              banana,바나나
            </Typography>
            <Typography sx={{ color: '#FFFFFF', mt: 1, fontSize: '0.9rem' }}>
              * 큰따옴표(") 사용 가능
            </Typography>
          </Box>

          <input
            accept=".csv,.txt"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              fullWidth
              sx={{
                mb: 2,
                backgroundColor: '#9b87f5',
                '&:hover': { backgroundColor: '#8b77e5' },
              }}
            >
              파일 선택
            </Button>
          </label>

          {file && (
            <Typography
              sx={{ color: '#FFFFFF', mb: 2, textAlign: 'center' }}
            >
              선택된 파일: {file.name}
            </Typography>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
            >
              {result.message}
              {result.duplicates?.length > 0 && (
                <Typography sx={{ mt: 1, fontSize: '0.9rem' }}>
                  중복된 단어: {result.duplicates.join(', ')}
                </Typography>
              )}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
            fullWidth
            sx={{
              backgroundColor: '#FF4081',
              '&:hover': { backgroundColor: '#E91E63' },
              '&.Mui-disabled': { backgroundColor: '#555' },
            }}
          >
            {loading ? <CircularProgress size={24} /> : '업로드'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default WordUploadPage; 