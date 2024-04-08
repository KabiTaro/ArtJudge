import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import card from './Card';
import Modal from '@mui/material/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

const settingModal: React.FC<{ isActive: boolean, OnClick: () => void ,SaveApiKey: () => void}> = ({ isActive ,OnClick,SaveApiKey}) => {
  const [api_key, setApiKey] = useState('');

  const saveApiKey = async () => {
    await AsyncStorage.setItem('APIKey', api_key);
    console.log('api_key' + api_key);
  };

  useEffect(() => {
    const getApiKey = async () => {
      const storedApiKey = await AsyncStorage.getItem('APIKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    };

    getApiKey();
  }, []);

  return (
    <Modal open={isActive}>
      <div className="modal-content">
        <div>
          <label htmlFor="apiKey">Anthropic APIキー:</label>
          <input
            type="password"
            id="apiKey"
            value={api_key}
            onChange={(e) => SaveApiKey(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button type="submit" onClick={saveApiKey}>
              保存
            </Button>
            <Button
              className="setting-btn"
              sx={{ marginLeft: '15px' }}
              onClick={OnClick}
            >
              閉じる
            </Button>
          </Box>
        </div>
      </div>
    </Modal>
  );
};
  export default settingModal;
