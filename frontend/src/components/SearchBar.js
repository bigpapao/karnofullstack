import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Autocomplete,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { toggleSearch } from '../store/slices/uiSlice';
import { useDirection } from '../contexts/DirectionContext';

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const inputRef = useRef(null);
  const [suggestions] = useState([
    { label: 'لنت ترمز', category: 'ترمز' },
    { label: 'فیلتر روغن', category: 'موتور' },
    { label: 'شمع', category: 'موتور' },
    { label: 'فیلتر هوا', category: 'موتور' },
    { label: 'کمک فنر', category: 'سیستم تعلیق' },
  ]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue)}`);
      dispatch(toggleSearch()); // Close search on mobile after submission
      setValue(null);
      setInputValue('');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <form onSubmit={handleSearch}>
        <Autocomplete
          freeSolo
          disablePortal
          options={suggestions}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : option.label
          }
          value={value}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            setValue(newValue);
            if (typeof newValue === 'string') {
              setInputValue(newValue);
            } else if (newValue && newValue.label) {
              setInputValue(newValue.label);
            } else {
              setInputValue('');
            }
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              placeholder="جستجوی قطعات، برندها یا دسته‌بندی‌ها..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  },
                },
                '& .MuiInputBase-input': {
                  fontWeight: 500,
                  color: 'primary.dark',
                },
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: isRTL ? (
                  <InputAdornment position="start">
                    <IconButton 
                      type="submit" 
                      edge="start" 
                      aria-label="search"
                      onClick={handleSearch}
                    >
                      <SearchIcon className="no-flip" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                endAdornment: !isRTL ? (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      edge="end" 
                      aria-label="search"
                      onClick={handleSearch}
                    >
                      <SearchIcon className="no-flip" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {option.label}
                <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  در {option.category}
                </Box>
              </Box>
            </Box>
          )}
        />
      </form>
    </Box>
  );
};

export default SearchBar;
