import axios from 'axios'


export const getDestList = (token) => {
  return axios.get('http://localhost:8080/destinations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getPlaceByIdDest = async(token,id)=>{
  const response = await axios.get(`http://localhost:8080/destinations/${id}`,{
    headers:{
      Authorization:`Bearer ${token}`,
    }
  })
}

export const getCategories = async (token) => {
  try {
    const response = await axios.get(`http://localhost:8080/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // console.log('categories',response.data)
    return response.data.categories || []
  } catch (err) {
    console.log(err)
    return []
  }
}

export const getPlaceByCateId = (token,id)=>{
  return axios.get (`http://localhost:8080/categories/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getPlaceListByDest = async (destinationId, token, categoryId=null) => {
  try {
    let getDestUrl = `http://localhost:8080/places/?destinationId=${destinationId}`
    if (categoryId){
      getDestUrl += `&categoryId=${categoryId}`
    }
    const response = await axios.get(getDestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return Array.isArray(response.data.places) ? response.data.places : [];
  } catch (err) {
    console.log(err)
    return []
  }
}


