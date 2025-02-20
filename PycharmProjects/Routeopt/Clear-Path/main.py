#imports

import pandas as pd
import requests
import numpy as np

places=pd.DataFrame()
print(places)

for i in range(2):
  search=input(f"Place {i+1}? ")

                    # SEARCH LOCATION BASED ON USER INPUT
  url1="https://api.baato.io/api/v1/search"
  params1={
      'key': 'bpk.uMsAWg9AUcMHeEq4ygkiyZ49K3KqGUsD6ea5J5WFGyha',
      'q': search,
      'limit':10
  }

  response=requests.get(url1,params1)
  data=response.json()['data']
  df=pd.DataFrame(data)[['name','address','type','placeId']]
  print(df)

  choice=int(input("make your choice "))
  option=np.int64(df['placeId'][choice-1])
  print(option)
  option_value = option.item()

            #FINDS DETAILS OF THE DESTINATION

  url2 = "https://api.baato.io/api/v1/places"

  params2 = {
      "key": "bpk.uMsAWg9AUcMHeEq4ygkiyZ49K3KqGUsD6ea5J5WFGyha",
      "placeId": option_value
  }

  response2 = requests.get(url2, params=params2)

  data2=response2.json()['data']

             #FINDS LATITUDE AND LONGITUDE OF DESTINATION
  df2=pd.DataFrame(data2)['centroid']
  print(df2)

  destination=df2[0]
  dest_lat=destination['lat']
  dest_long=destination['lon']

  temp_df=pd.DataFrame({'lat':[np.nan],'lon':[np.nan]})
  temp_df.fillna({'lat': dest_lat}, inplace=True)
  temp_df.fillna({'lon': dest_long}, inplace=True)

  places=pd.concat([places,temp_df],ignore_index=True)

  print(dest_lat)
  print(dest_long)

print(places)

print(f"Points: {places['lat'][0]},{places['lon'][0]};{places['lat'][1]},{places['lon'][1]}")

   