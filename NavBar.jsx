import  { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faSearch, faCompass, faFilm, faCommentDots, faHeart, faPlusSquare, faUser, faBars,
} from '@fortawesome/free-solid-svg-icons';
import {
  Box, Button, Input, VStack, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, useDisclosure,
} from '@chakra-ui/react';

const NavBar = ({ onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('Home');
  const searchInputRef = useRef(null);
  const uploadInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newSelectedImages = [...selectedImages, ...files];
    setSelectedImages(newSelectedImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    onOpen();
  };

  const handleUpload = async () => {
    if (selectedImages.length > 0) {
      setUploading(true);
      try {
        await onUpload(selectedImages);
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setSelectedImages([]);
        setPreviews([]);
        setUploading(false);
        onClose();
      }
    }
  };

  const closeModal = () => {
    setSelectedImages([]);
    setPreviews([]);
    onClose();
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

  const iconData = [
    { icon: faHome, name: 'Home' },
    { icon: faSearch, name: 'Search', action: handleSearchClick },
    { icon: faCompass, name: 'Explore' },
    { icon: faFilm, name: 'Reels' },
    { icon: faCommentDots, name: 'Messages' },
    { icon: faHeart, name: 'Notifications' },
    { icon: faPlusSquare, name: 'Create', upload: true },
    { icon: faUser, name: 'Profile' },
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
          <Image src="logo.png" alt="Instagram" h={10} />
        </Box>
        <VStack spacing={2} mt={6} align="flex-start" flex="1" width="100%">
          {iconData.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              leftIcon={<FontAwesomeIcon icon={item.icon} size="lg" />}
              _hover={{ bg: 'whiteAlpha.300' }}
              color="whiteAlpha.800"
              fontSize="sm"
              onClick={() => {
                setActiveItem(item.name);
                if (item.upload) {
                  uploadInputRef.current.click();
                } else {
                  item.action && item.action();
                }
              }}
              w="100%"
              justifyContent="flex-start"
              bg={activeItem === item.name ? 'gray.700' : 'transparent'}
            >
              {item.name === 'Search' && showSearch ? (
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  bg="gray.800"
                  textColor="white"
                  rounded="md"
                  w="full"
                  ref={searchInputRef}
                />
              ) : (
                item.name
              )}
            </Button>
          ))}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={uploadInputRef}
            style={{ display: 'none' }}
          />
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Images</ModalHeader>
          <ModalBody>
            <Box className="preview-container" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
              {previews.map((preview, index) => (
                <Image
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="preview-image"
                  maxW="full"
                  maxH="40"
                  objectFit="cover"
                />
              ))}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal} colorScheme="red" mr={3}>
              Cancel
            </Button>
            <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading}>
              {uploading ? <Spinner size="sm" /> : 'Upload'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NavBar;
