import AvatarWithStreakIndicador from "@/components/AvatarWithStreakIndicator";
import { Text } from "@/components/Themed";
import { Center } from "@/components/ui/center";
import UserProgressBar from "@/components/UserProgressBar";
import { useAtom } from "jotai";

export default function Home() {
  return (
    <Center className="flex-1">
      <AvatarWithStreakIndicador />
      <UserProgressBar />
    </Center>
  );
}
