// src/pages/SharePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';
import axiosInstance from "../services/axiosInstance";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SharePage = () => {
  const { designId } = useParams();
  const [design, setDesign] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await axiosInstance.get(`${BASE_URL}/share/${designId}`,{
          withCredentials: true,}
        );
        setDesign(res.data);
      } catch (err) {
        console.error('Failed to fetch design');
      }
    };
    fetchDesign();
  }, [designId]);

  const handleCopy = () => {
    if (design?.imageUrl) {
      navigator.clipboard.writeText(design.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container maxWidth="sm">
      {design && (
        <Box mt={4} textAlign="center">
          <Typography variant="h5" mb={2}>
            {design.title || 'Shared Design'}
          </Typography>

          <img
            src={design.imageUrl}
            alt="Shared Design"
            style={{ width: '100%', borderRadius: '12px' }}
          />

          <Typography mt={3}>Share this design:</Typography>

          <Box mt={1} display="flex" justifyContent="center" gap={2}>
            <IconButton
              onClick={() =>
                window.open(`https://wa.me/?text=Check this design: ${encodeURIComponent(design.imageUrl)}`, '_blank')
              }
              sx={{ color: '#25D366' }}
            >
              <WhatsAppIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(design.imageUrl)}`, '_blank')
              }
              sx={{ color: '#1877F2' }}
            >
              <FacebookIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(design.imageUrl)}&text=Check this design`, '_blank')
              }
              sx={{ color: '#1DA1F2' }}
            >
              <XIcon />
            </IconButton>
          </Box>

          <Typography mt={4} mb={1}>Copy Shareable Link:</Typography>

          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <TextField
              variant="outlined"
              size="small"
              value={design.imageUrl}
              InputProps={{ readOnly: true }}
              sx={{ width: '75%' }}
            />
            <Button onClick={handleCopy} variant="outlined" startIcon={<ContentCopyIcon />}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default SharePage;



