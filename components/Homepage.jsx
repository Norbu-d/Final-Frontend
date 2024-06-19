import  { useState } from 'react';
import NavBar from './NavBar';
import Post from './Post';
import { Box, Flex } from '@chakra-ui/react';

const Homepage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        username: 'Dorji',
        avatar: 'https://via.placeholder.com/150',
      },
      imageUrls: ['https://via.placeholder.com/600'],
      likes: 0,
      comments: [
        { username: 'janedoe', text: 'Nice picture!', timestamp: new Date() },
        { username: 'user123', text: 'Amazing!', timestamp: new Date() },
      ],
      timestamp: new Date(),
    },
  ]);

  const handleUpload = (imageFiles) => {
    const imageUrls = imageFiles.map(file => {
      const url = URL.createObjectURL(file);
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return url;
    });

    const newPost = {
      id: posts.length + 1,
      user: {
        username: 'current_user',
        avatar: 'https://via.placeholder.com/150',
      },
      imageUrls,
      likes: 0,
      comments: [],
      timestamp: new Date(),
    };

    setPosts([newPost, ...posts]);
  };

  return (
    <Box className="Homepage">
      <NavBar onUpload={handleUpload} />
      <Flex justifyContent="center" mt="16" p="4">
        <Box w="full" maxW="xl">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default Homepage;