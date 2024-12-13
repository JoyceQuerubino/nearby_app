import { useEffect, useState, useRef } from "react"
import { View, Alert, Modal, StatusBar, ScrollView } from "react-native"
import { router, useLocalSearchParams, Redirect } from "expo-router"

import { Button } from "@/components/button"
import { Loading } from "@/components/loading"

import { api } from "@/services/api"
import { Cover } from "@/components/market/cover"
import { Details, PropsDetails } from "@/components/market/details"

type DataProps = PropsDetails & {
  cover: string
}

export default function Market() {
  const [data, setData] = useState<DataProps>()
  const [coupon, setCoupon] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [couponIsFetching, setCouponIsFetching] = useState(false)
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)

  const params = useLocalSearchParams<{id: string}>();//pra pegar o id que vem por rota

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`)
      setData(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    }
  }

  useEffect(() => {
    fetchMarket()
  }, [params.id])

  if(isLoading){
    return <Loading/>
  }

  if(!data){
    return < Redirect href={"/home"}/>
  }

  return (
    <View style={{ flex: 1 }}>
     <Cover uri={data.cover}/>

     <Details data={data}/>
    </View>
  )
}