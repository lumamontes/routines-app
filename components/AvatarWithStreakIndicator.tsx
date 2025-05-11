import { useAtom } from "jotai"
import { Text } from "./Themed"
import { Box } from "./ui/box"
import { Image } from "./ui/image"
// import { userStreakAtom } from "@/atoms"
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "./ui/avatar"
import { avatarUriAtom } from "@/store/avatar"
import * as ImagePicker from "expo-image-picker"
import { Pressable } from "react-native"

function LogoAvatar({ streak }: { streak: number }) {
  const [avatarUri, setAvatarUri] = useAtom(avatarUriAtom)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri)
      console.log("Selected image URI:", result.assets[0].uri)
    }
  }

  console.log("Current avatarUri:", avatarUri)

  const isValidBase64 = (uri: string) => {
    return uri.startsWith('data:image/')
  }

  return (
    <Box className="relative">
      <Pressable onPress={pickImage}>
        <Avatar size="2xl">
          <AvatarImage
            source={{ uri: isValidBase64(avatarUri) ? avatarUri : "https://cdn.discordapp.com/attachments/1121950982035005952/1151234567890123456/avatar.png" }}
            alt="Avatar"
          />
          <AvatarFallbackText>
            <Image
              source={{ uri: isValidBase64(avatarUri) ? avatarUri : "https://cdn.discordapp.com/attachments/1121950982035005952/1151234567890123456/avatar.png" }}
              alt="Avatar"
            />
            <Text className="text-typography-400 text-xs font-bold">
              {streak}
            </Text>
          </AvatarFallbackText>
          <AvatarBadge>
            <Text className="text-typography-400 text-xs font-bold">
              {streak}
            </Text>
          </AvatarBadge>
        </Avatar>
      </Pressable>
    </Box>
  )
}

export default function AvatarWithStreakIndicador() {
  return <LogoAvatar streak={0} />
}