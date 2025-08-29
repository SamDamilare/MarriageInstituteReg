import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  return (
    <Box
      w="100vw"
      h="100vh"
      bgImage="url('https://res.cloudinary.com/dktrwqio1/image/upload/v1756452541/NYRadio/KCM/cropped-photo-hands-black-man-wearing-engagement-ring-his-girlfriend-s-finger_myyo5k.jpg')"
      bgSize="cover"
      bgRepeat="no-repeat"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        w: "100%",
        h: "100%",
        bg: "rgba(0, 0, 0, 0.8)",
        zIndex: 0,
      }}
    >
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
        color="white"
        px={4} // padding for small screens
        textAlign="center"
      >
        <Box width={"400px"}>
          {/* <Image
            src="https://res.cloudinary.com/dktrwqio1/image/upload/v1756331446/NYRadio/KCM/TTH1_iwogft.png"
            width={"200px"}
          /> */}

          <Heading>MARRIAGE INSTITUTE</Heading>
          <Text mt={4}>
            The Marriage Institute is a covenant platform designed to prepare
            and equip couples for a godly home. Through the light of God’s Word
            and the help of the Holy Spirit, you will receive wisdom, guidance,
            and prophetic covering to build a marriage that reflects Christ and
            the Church.
            <br />
            Please click the button below to register.
          </Text>

          <Button
            w="full"
            mt={4}
            bg="white"
            color="#072143"
            _hover={{ bg: "gray.200" }}
            onClick={() => navigate("/forms")}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
