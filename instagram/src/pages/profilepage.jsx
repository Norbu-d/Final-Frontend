import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Stack,
  Avatar,
  Grid,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaCog } from "react-icons/fa";
import NavBar from "../../../components/NavBar";
import axios from "axios";

const ProfilePage = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchedUserData = {
          avatar: "https://via.placeholder.com/150",
          name: "Norbu Dendup",
          bio: "To get the throne\nU gotta walk the stairs up#",
          postsCount: 2,
          followersCount: 99,
          followingCount: 104,
        };
        setUserData(fetchedUserData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  const fetchFollowers = async () => {
    try {
      const response = await axios.get(`/api/users/${username}/followers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFollowers(response.data);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const response = await axios.get(`/api/users/${username}/following`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleFollowersClick = () => {
    fetchFollowers();
    setIsFollowersModalOpen(true);
  };

  const handleFollowingClick = () => {
    fetchFollowing();
    setIsFollowingModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <Box display="flex">
      <NavBar />
      <Box
        flex="1"
        maxW="935px"
        mx="auto"
        p="20px"
        ml="400px"
        overflowY="auto"
        h="100vh"
      >
        <Stack
          direction="row"
          spacing="30px"
          pb="20px"
          borderBottom="1px solid #dbdbdb"
        >
          <Avatar size="2xl" src={userData.avatar} />
          <Stack spacing="25px" flex="1">
            <Stack direction="row" alignItems="center" spacing="10px">
              <Text fontSize="2xl" fontWeight="bold">
                {username}
              </Text>
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
              <Icon as={FaCog} w={5} h={5} />
            </Stack>
            <Stack direction="row" spacing="10px">
              <Text>
                <strong>{userData.postsCount}</strong> posts
              </Text>
              <Text onClick={handleFollowersClick} cursor="pointer">
                <strong>{userData.followersCount}</strong> followers
              </Text>
              <Text onClick={handleFollowingClick} cursor="pointer">
                <strong>{userData.followingCount}</strong> following
              </Text>
            </Stack>
            <Box>
              <Text fontWeight="bold">{userData.name}</Text>
              <Text>{userData.bio}</Text>
            </Box>
          </Stack>
        </Stack>
        <Text fontSize="2xl" fontWeight="bold" pt="20px">
          Posts
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap="2px" pt="20px">
          {posts.map((post, index) => (
            <Box key={index} position="relative">
              <Image
                src={post}
                alt={`Post ${index}`}
                boxSize="200px"
                objectFit="cover"
              />
            </Box>
          ))}
        </Grid>

        {/* Followers Modal */}
        <Modal
          isOpen={isFollowersModalOpen}
          onClose={() => setIsFollowersModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Followers</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={3}>
                {followers.map((follower, index) => (
                  <ListItem key={index}>{follower}</ListItem>
                ))}
              </List>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Following Modal */}
        <Modal
          isOpen={isFollowingModalOpen}
          onClose={() => setIsFollowingModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Following</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={3}>
                {following.map((follow, index) => (
                  <ListItem key={index}>{follow}</ListItem>
                ))}
              </List>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProfilePage;
