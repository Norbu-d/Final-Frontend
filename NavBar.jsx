// NavBar.js
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faSearch, faCompass, faFilm, faCommentDots, faHeart, faPlusSquare, faUser, faBars,
} from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Input, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NavBar = ({ onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newSelectedImages = [...selectedImages, ...files];
    setSelectedImages(newSelectedImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (selectedImages.length > 0) {
      setUploading(true);
      try {
        console.log('Uploading images:', selectedImages);
        await onUpload(selectedImages);
        console.log('Upload successful');
      } catch (error) {
        console.error("Error uploading images:", error);
      } finally {
        setSelectedImages([]);
        setPreviews([]);
        setUploading(false);
        setShowModal(false);
      }
    }
  };

  const closeModal = () => {
    setSelectedImages([]);
    setPreviews([]);
    setShowModal(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 0);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    console.log('Performing search for:', searchQuery);
    setShowSearch(false);
  };

  const handleCreateClick = () => {
    if (!showModal) {
      setShowModal(true);
      document.getElementById('upload-input').click();
    }
  };

  const handleHomeClick = () => {
    navigate('/'); // Navigate to the home page
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  const iconData = [
    { icon: faHome, name: 'Home', action: handleHomeClick },
    { icon: faSearch, name: 'Search', action: handleSearchClick },
    { icon: faCompass, name: 'Explore' },
    { icon: faFilm, name: 'Reels' },
    { icon: faCommentDots, name: 'Messages' },
    { icon: faHeart, name: 'Notifications' },
    { icon: faPlusSquare, name: 'Create', action: handleCreateClick },
    { icon: faUser, name: 'Profile', action: handleProfileClick }, // Add action for profile button
    { icon: faBars, name: 'More' },
  ];

  return (
    <>
      <Box
        bg="black"
        color="whiteAlpha.800"
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w="56"
        zIndex={10}
        transition="all 0.3s"
      >
        <Box mb={4}>
          <img src="/logo.png" alt="Instagram" className="h-10" />
        </Box>
        <VStack spacing={2} mt={6} align="flex-start" flex="1">
          {iconData.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              leftIcon={<FontAwesomeIcon icon={item.icon} size="lg" />}
              _hover={{ bg: 'whiteAlpha.300' }}
              color="whiteAlpha.800"
              fontSize="sm"
              onClick={item.action}
              w="100%"
              justifyContent="flex-start"
            >
              {item.name === 'Search' && showSearch ? (
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  className="p-2 bg-gray-800 text-white rounded focus:outline-none w-full"
                  ref={searchInputRef}
                />
              ) : item.name === 'Create' ? (
                'Create'
              ) : (
                item.name
              )}
              {item.name === 'Create' && showModal && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="upload-input"
                />
              )}
            </Button>
          ))}
        </VStack>
      </Box>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="bg-white p-4 rounded-lg w-2/3 max-w-lg">
            <h2 className="text-lg mb-2">Preview Images</h2>
            <div className="preview-container grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="preview-image max-w-full h-auto object-cover"
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <Button
                onClick={closeModal}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                className={`bg-blue-500 text-white py-2 px-4 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} text-sm`}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

NavBar.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default NavBar;
