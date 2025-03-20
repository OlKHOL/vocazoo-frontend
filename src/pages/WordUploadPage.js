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
      // 파일 정보 상세 로깅
      console.log('=== 파일 업로드 시작 ===');
      console.log('파일 정보:', {
        이름: file.name,
        크기: `${file.size} bytes`,
        타입: file.type,
        최종수정: new Date(file.lastModified).toLocaleString()
      });

      // 파일 내용 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        console.log('파일 내용 미리보기 (처음 500자):', content.substring(0, 500));
      };
      reader.readAsText(file);

      const response = await api.post('/admin/upload_words', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });

      console.log('=== 서버 응답 상세 ===');
      console.log('상태 코드:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 데이터:', response.data);

      if (response.status === 422) {
        console.error('=== 422 에러 상세 정보 ===');
        console.error('에러 메시지:', response.data.error);
        console.error('상세 에러:', response.data.details);
        console.error('중복 단어:', response.data.duplicates);
        
        let errorMessage = `업로드 오류: ${response.data.error}`;
        if (response.data.details) {
          errorMessage += `\n\n상세 오류:\n${response.data.details.join('\n')}`;
        }
        if (response.data.duplicates) {
          errorMessage += `\n\n중복된 단어:\n${response.data.duplicates.join(', ')}`;
        }
        setError(errorMessage);
        return;
      }

      if (response.status !== 200) {
        console.error('=== 기타 에러 상세 정보 ===');
        console.error('상태 코드:', response.status);
        console.error('에러 데이터:', response.data);
        setError(`업로드 실패: ${response.data.error || '알 수 없는 오류가 발생했습니다'}`);
        return;
      }

      setResult({
        success: true,
        message: response.data.message,
        duplicates: response.data.duplicates,
      });
    } catch (error) {
      console.error('=== 예외 발생 상세 정보 ===');
      console.error('에러 객체:', error);
      console.error('에러 메시지:', error.message);
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
        console.error('응답 헤더:', error.response.headers);
      }
      setError(`업로드 중 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('=== 파일 업로드 종료 ===');
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