import { useState } from "react";
import {View, Text, SafeAreaView} from "react-native";
import {Stack,useRouter} from "expo-router";

import {COLORS, icons, images, SIZES} from "../constants";
import {Nearbyjobs, Popularjobs, ScreenHeaderBtn, Welcome} from "../components"

const Home = () =>{
    const router = useRouter();
    return(
    <SafeAreaView style = {{ flex:1, backfaceVisibility: 
     COLORS.lightWhite }}>
        <Stack.Screen
        options = {{
            headerStyle: {backgroundColor: COLORS.lightWhite}
        }}
        />
    </SafeAreaView>
)}

export default Home;