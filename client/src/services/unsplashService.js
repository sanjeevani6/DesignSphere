// src/service/unsplashService.js
import axios from 'axios';


const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY ;
export const fetchTemplatesFromUnsplash = async (query = 'backgrounds') => {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 30,
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });
    return response.data.results.map(img => ({
      url: img.urls.regular,
      fileName: img.alt_description || 'Unsplash Image',
    }));
  } catch (err) {
    console.error("Unsplash API error:", err);
    return [];
  }
};
