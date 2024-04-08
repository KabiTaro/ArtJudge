import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MainCard from './Card';
import Modal from '@mui/material/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

interface Review {
  title: string;
  drawing_score: number;
  comment: string;
  usage: Usage;
}

interface Usage {
  output_tokens: number;
  input_tokens: number;
}

interface SnackbarState {
  message: string;
  severity: string;
}
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageToBase64: React.FC = () => {
  const [isOpenSnackBar, setIsOpenSnackBar] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [reviewModal, setreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [snackState, setSnackState] = useState<SnackbarState>({
    message: '',
    severity: 'success',
  });
  const [api_key, setApiKey] = useState('');

  const [base64String, setBase64String] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const getApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('APIKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    };

    getApiKey();
  }, []);
  const handleClose = () => {
    setIsOpenSnackBar(false);
  };
  const showMessage = (message: string, severity: string) => {
    setSnackState({ message, severity });
    setIsOpenSnackBar(true);
  };

  const openSettingModal = () => {
    setSettingModal(true);
  };

  const closeSettingModal = () => {
    setSettingModal(false);
  };
  const openReviewModal = () => {
    setreviewModal(true);
  };

  const closeReviewModal = () => {
    setreviewModal(false);
  };

  const saveApiKey = async () => {
    await AsyncStorage.setItem('APIKey', api_key);
    showMessage('Claude APIキーを保存しました', 'success');
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileName = file.name;
        let extension = fileName.split('.').pop();
        if (extension == 'jpg'){
          extension = 'jpeg'
        }
        const mediaType = `image/${extension}`;

        setIsLoading(true);
        const base64 = await convertFileToBase64(file);
        setBase64String(base64);

        const response = await sendImageForReview(base64, mediaType);
        const review: Review = response.data;

        setIsLoading(false);
        showMessage('評価に成功しました', 'success');
        setReview(review);
        openReviewModal();
      } catch (error: unknown) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          const message = error.response
            ? error.response.data
            : '未知のエラーが発生しました';
          showMessage('評価に失敗しました: ' + message.error, 'error');
        } else if (error instanceof Error) {
          showMessage('評価に失敗しました: ' + error, 'error');
        } else {
          showMessage('評価に失敗しました: 未知のエラー', 'error');
        }
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const sendImageForReview = async (base64: string, mediaType: string) => {
    const response = await axios.post('http://localhost:30000/apiv1/review', {
      api_key,
      image_data: base64.replace(
        /^data:image\/(png|jpeg|gif|webp);base64,/,
        '',
      ),
      media_type: mediaType,
    });
    return response;
  };

  return (
    <div className="Main" style={{ textAlign: 'center' }}>
      <h1>描いた絵を評価君</h1>

      <Modal open={settingModal}>
        <div className="modal-content">
          <div>
            <label htmlFor="apiKey">Claude APIキー:</label>
            <input
              type="password"
              id="apiKey"
              value={api_key}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="contained" color="success" onClick={saveApiKey}>
                保存
              </Button>
              <Button
                className="setting-btn"
                variant="contained"
                color="error"
                sx={{ marginLeft: '15px' }}
                onClick={closeSettingModal}
              >
                閉じる
              </Button>
            </Box>
          </div>
        </div>
      </Modal>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          size="large"
        >
          <i className="fas fa-palette"></i>作品を評価してもらう(jpg,bmp,png,gif)
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Button
          sx={{ marginLeft: 'auto' }}
          onClick={openSettingModal}
          className="setting-btn"
          size="large"
          variant="outlined"
        >
          <i className="fas fa-cog"></i>設定
        </Button>
      </Box>

      <MainCard />

      <Modal open={isLoading}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={330} />
          <Typography gutterBottom variant="h3" sx={{ color: 'white' }}>
            作品を評価中...
          </Typography>
        </Box>
      </Modal>

      {base64String && review && (
        <Modal
          open={reviewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
            <Button
              color="error"
              variant="contained"
              className="setting-btn"
              sx={{ margin: '15px' }}
              onClick={closeReviewModal}
            >
              閉じる
            </Button>
            <div className="image-container">
              <h3>絵の評価:</h3>
              <table>
                <tbody>
                  <tr>
                    <td>タイトル</td>
                    <td>{review?.title}</td>
                  </tr>
                  <tr>
                    <td>絵の上手さ</td>
                    <td>
                      <Rating
                        name="customized-10"
                        size="large"
                        value={review?.drawing_score}
                        max={10}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>コメント</td>
                    <td>{review?.comment}</td>
                  </tr>
                  <tr>
                    <td>画像</td>
                    <td>
                      <img src={base64String} alt="Uploaded" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography gutterBottom variant="h6" component="div">
                  入力消費トークン数 | 実際の費用($0.25/million tokens)
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {review?.usage?.input_tokens} | $
                  {(review?.usage?.input_tokens / 10000000) * 0.25}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography gutterBottom variant="h6" component="div">
                  出力消費トークン数 | 実際の費用($1.25/million tokens)
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {review?.usage?.output_tokens} | $
                  {(review?.usage?.output_tokens / 10000000) * 1.25}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography gutterBottom variant="h6" component="div">
                  合計費用
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  $
                  {(review?.usage?.input_tokens / 10000000) * 0.25 +
                    (review?.usage?.output_tokens / 10000000) * 1.25}
                </Typography>
              </Stack>
            </div>
          </div>
        </Modal>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isOpenSnackBar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          severity={snackState.severity as AlertColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImageToBase64;
