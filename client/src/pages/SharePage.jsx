import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  IconButton,
  TextField,
  Button,
  Paper
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axiosInstance from '../services/axiosInstance';
import Header from '../components/Layouts/Header';

const SharePage = ({ user }) => {
  console.log('SharePage user:', user);
  const { designId } = useParams();
  const [design, setDesign] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/share/${designId}`, {
          withCredentials: true,
        });
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
    <>
      <Header user={user} />
      <div
        style={{
          backgroundColor: '#fffdf0',
          minHeight: 'calc(100vh - 60px)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            p: 3,
            maxWidth: 500,
            width: '100%',
            backgroundColor: '#fffdf0',
            border: '2px solid #f6bea9',
          }}
        >
          {design && (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Chewy', cursive",
                  color: '#519bc5',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Share Your Design
              </Typography>

              <img
                src={design.imageUrl}
                alt="Shared Design"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid #ccc',
                  marginBottom: '16px',
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Chewy', cursive",
                  color: '#ffb8b8',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Share this design with your friends!
              </Typography>

              <Box display="flex" justifyContent="center" gap={2} mb={3}>
                <IconButton
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=Check this design: ${encodeURIComponent(design.imageUrl)}`,
                      '_blank'
                    )
                  }
                  sx={{ color: '#25D366' }}
                >
                  <WhatsAppIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(design.imageUrl)}`,
                      '_blank'
                    )
                  }
                  sx={{ color: '#1877F2' }}
                >
                  <FacebookIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    window.open(
                      `https://x.com/intent/tweet?url=${encodeURIComponent(design.imageUrl)}&text=Check this design`,
                      '_blank'
                    )
                  }
                  sx={{ color: '#1DA1F2' }}
                >
                  <XIcon />
                </IconButton>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  textAlign: 'center',
                  mb: 1,
                  color: '#444',
                }}
              >
                Copy Shareable Link:
              </Typography>

              <Box display="flex" gap={1} alignItems="center">
                <TextField
                  variant="outlined"
                  size="small"
                  value={design.imageUrl}
                  InputProps={{ readOnly: true }}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#90b0e6' },
                      '&:hover fieldset': { borderColor: '#90b0e6' },
                      '&.Mui-focused fieldset': { borderColor: '#90b0e6' },
                    },
                  }}
                />
                <Button
                  onClick={handleCopy}
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    backgroundColor: '#90b0e6',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#519bc5' },
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </div>
    </>
  );
};

export default SharePage;
