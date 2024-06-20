import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Image as ChakraImage, Input, Flex, Text } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Fetch comments from server when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/Homepage/post/${post.id}/comments`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]);

  // Fetch like status from server when component mounts
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/Homepage/post/${post.id}/like-status`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const likeStatus = await response.json();
        setLiked(likeStatus.liked);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [post.id]);

  const handleLike = async () => {
    setLiked(!liked);

    try {
      const response = await fetch(`http://localhost:3000/Homepage/post/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked: !liked }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      setLiked(!liked); // Revert like status if there's an error
    }
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = () => {
    if (commentText.trim() === '') {
      return; // Prevent posting empty comments
    }

    // Construct new comment object
    const newComment = {
      username: 'current_user', // Replace with actual current user data
      text: commentText,
      timestamp: new Date().toLocaleString(), // Add timestamp
    };

    // Update state to include new comment
    setComments([...comments, newComment]);

    // Reset comment input and hide the input field
    setCommentText('');
    setShowCommentInput(false);
  };

  return (
    <Box bg="black" color="white" mb={5} borderRadius="md" overflow="hidden">
      <Flex alignItems="center" p={4}>
        <ChakraImage src={post.user.profilePic} alt="profile" boxSize="10" rounded="full" mr={4} />
        <Box>
          <Text fontWeight="bold">{post.user.username}</Text>
          <Text color="gray.500" fontSize="sm">{new Date(post.timestamp).toLocaleString()}</Text>
        </Box>
      </Flex>
      <Carousel showThumbs={false} showStatus={false} infiniteLoop dynamicHeight>
        {post.imageUrls.map((imageUrl, index) => (
          <div key={index}>
            <ChakraImage src={imageUrl} alt={`Post ${index}`} w="full" h="600px" objectFit="cover" />
          </div>
        ))}
      </Carousel>
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Flex alignItems="center">
          <Button onClick={handleLike} mr={2} variant="unstyled">
            <FontAwesomeIcon icon={faHeart} size="lg" color={liked ? "red" : "white"} />
          </Button>
          <Button onClick={toggleCommentInput} mr={2} variant="unstyled">
            <FontAwesomeIcon icon={faComment} size="lg" color="white" />
          </Button>
          <Button variant="unstyled">
            <FontAwesomeIcon icon={faShare} size="lg" color="white" />
          </Button>
        </Flex>
      </Flex>
      {showCommentInput && (
        <Flex alignItems="center" borderTop="1px" borderColor="gray.700" p={4}>
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={handleCommentChange}
            bg="black"
            textColor="white"
            border="none"
            focusBorderColor="none"
            flex="1"
          />
          <Button onClick={handlePostComment} colorScheme="blue" fontWeight="semibold" px={3} ml={2}>Post</Button>
        </Flex>
      )}
      <Box px={4} pb={2}>{liked ? post.likes + 1 : post.likes} likes</Box>
      <Box px={4} pb={4}>
        {comments.map((comment, index) => (
          <Flex key={index} alignItems="center" mb={1}>
            <Box flex="1">
              <Text fontWeight="bold" mr={2}>{comment.username}</Text>
              <Text color="gray.500" fontSize="sm">{new Date(comment.timestamp).toLocaleString()}</Text>
            </Box>
            <Text>{comment.text}</Text>
          </Flex>
        ))}
      </Box>
      <Box px={4} pb={4}>
        <Text fontWeight="bold" mr={2}>{post.user.username}</Text>{post.caption}
      </Box>
    </Box>
  );
};

export default Post;
