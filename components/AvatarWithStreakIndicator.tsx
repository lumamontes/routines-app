import { useAtom } from "jotai"
import { Text } from "./Themed"
import { Box } from "./ui/box"
import { Image } from "./ui/image"
// import { userStreakAtom } from "@/atoms"
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "./ui/avatar"

function LogoAvatar({ streak }: { streak: number }) {
  return (
    <Box className="relative">
      <Avatar size="2xl">
        <AvatarImage
          source={{
            uri: 
              "https://cdn.discordapp.com/attachments/1121950982035005952/1151234567890123456/avatar.png",
          }}
          alt="Avatar"
          className="w-42 h-42 rounded-full"
        />
        <AvatarFallbackText>
          <Image
            source={{
              uri: "https://cdn.discordapp.com/attachments/1121950982035005952/1151234567890123456/avatar.png",
            }}
            alt="Avatar"
            className="w-42 h-42 rounded-full"
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
    </Box>
  )
}

export default function AvatarWithStreakIndicador() {
  // const [userStreak] = useAtom(userStreakAtom)
  return (
    <LogoAvatar streak={0} />
  )
}