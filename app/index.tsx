import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";

export default function Home() {
  return (
    <View className="flex-1 bg-background-50 dark:bg-background-50 px-6 py-8">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 32,
        }}
      >
        <View className="max-w-96 w-full dark:bg-dark-200 rounded-lg shadow-lg p-8 mb-8">
          <View className="items-center mb-6">
            <Image
              source={require("@/assets/gifs/welcome.gif")}
              alt="Welcome"
              className="w-20 h-20 rounded-full"
            />
          </View>

          <Text className="text-3xl font-semibold text-center text-primary-900 dark:text-primary-100 mb-4">
            Bem-vindo(a) ao Tarefitas
          </Text>

          <View className="h-0.5 bg-primary-400 dark:bg-primary-400 my-6 w-1/3 mx-auto" />

          <Text className="text-base text-center text-typography-700 dark:text-typography-300 mb-6">
            O Tarefitas é um aplicativo de gerenciamento de tarefas para organizar
            suas atividades diárias e aumentar sua produtividade.
          </Text>

          <Text className="text-sm text-center text-typography-600 dark:text-typography-400 mb-8">
            Personalize a aplicação para uma experiência mais fluida e agradável.
          </Text>
        </View>

        {/* Buttons Section */}
        <View className="flex-row justify-center gap-4 mb-8">
          <Link href="/onboarding" asChild>
            <Button className="bg-primary-500 py-3 px-6 rounded-full shadow-md">
              <ButtonText className="font-semibold text-base">
                COMEÇAR
              </ButtonText>
            </Button>
          </Link>

          <Link href="/" asChild>
            <Button className="bg-transparent py-3 px-6 rounded-full border-2 border-primary-500">
              <ButtonText className="text-primary-500 font-semibold text-base">
                PULAR
              </ButtonText>
            </Button>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
